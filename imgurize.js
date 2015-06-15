//0b4d9e43c145774
//74542f2b794fdb874d9d790de40dccf7bb09a8da
var blessed = require('blessed');
var fs = require('fs');
var request = require('request');
var ImageToAscii = require("image-to-ascii");
var program = blessed.program();

var screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  dockBorders: true
});
screen.title = "imgurizer";

var layout = blessed.layout({
  width: '100%',
  height: '100%'
});

var title_text = blessed.text({
  width: '100%',
  align: 'center',
  content: 'imgurizer',
  style: {
    fg: 'black',
    bg: '#2ECC71'
  }
});

var post_text = blessed.text({
  width: '100%',
  align: 'center',
  content: 'imgurizer',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'white'
    }
  }
});

var content_box = blessed.box({
  width: '100%',
  content: '',
  style: {
    fg: 'white',
    border: {
      fg: 'white'
    }
  },
  scrollable: true,
  alwaysScroll: true
});

var post_box = blessed.box({
  content: '',
  align: 'center',
  style: {
    fg: 'white',
  },
  scrollable: true,
  alwaysScroll: true
});

var title_line = blessed.line({
  width: '100%',
  orientation: 'horizontal',
  style: {
    fg: 'white'
  }
});

screen.append(layout);
layout.append(title_text);
layout.append(post_text);
layout.append(content_box);
content_box.append(post_box);
//content_box.append(title_line);

getGallery(0, function(err, res, body){
  //TODO: handle error
  if(!err){
    gallery = JSON.parse(body).data;
    setPost(0);
  }
  else{
    console.log("error!")
  }
});

screen.render();

var num = 0;
var gallery = null;
var page = 0;
var scroll = 0;

function getGallery(page, callback){
  request({
    url: "https://api.imgur.com/3/gallery.json?page=" + page + "&perPage=30",
    headers: {
      "Authorization": "Client-ID 0b4d9e43c145774"
    }
  }, callback);
};

function setPost(num){
  var obj = gallery[num];
  //console.log(obj);
  if(obj.title){
    post_text.setContent(obj.title);
  }
  else{
    post_text.setContent("no title");
  }

  post_box.setContent("");
  //link
  if(obj.is_album === false){
    if(obj.type === "image/png" || obj.type === "image/jpeg"){
      ImageToAscii(obj.link, function(err, converted) {
          if(converted){
            post_box.pushLine(converted);
          }
          else{
            post_box.pushLine("no content");
          }

          if(obj.description){
            post_box.pushLine(obj.description);
          }
          else{

          }

        screen.render();
      });
    }
    else{
      post_box.pushLine("gif");
      screen.render();
    }
  }
  else{
    post_box.pushLine("album");
    screen.render();
  }
}

screen.key('down', function(ch, key) {
  if(scroll < post_box.height){
    scroll+=1;
    post_box.scrollTo(scroll);
    screen.render();
  }
});

screen.key('up', function(ch, key) {
  if(scroll > 0){
    scroll-=1;
    post_box.scrollTo(scroll);
    screen.render();
  }
});

screen.key('left', function(ch, key) {
  if(num === 0){
    if(page === 0){
      //can't go back
    }
    else{
      page--;
      num = 29;

      getGallery(page, function(err, res, body){
        //TODO: handle error
        if(!err){
          gallery = JSON.parse(body).data;
          setPost(29);
        }
        else{
          console.log("error!")
        }
      });
    }
  }
  else{
    num--;
    setPost(num);
  }
});

screen.key('right', function(ch, key) {
  if(num === 29){
    page++;
    num = 0;
    getGallery(page, function(err, res, body){
      //TODO: handle error
      if(!err){
        gallery = JSON.parse(body).data;
        setPost(0);
      }
      else{
        console.log("error!")
      }
    });
  }
  else{
    num++;

    setPost(num);
  }
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
