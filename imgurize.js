//0b4d9e43c145774
//74542f2b794fdb874d9d790de40dccf7bb09a8da
var blessed = require('blessed');
var fs = require('fs');
var ai = require('ascii-images');
var request = require('request');

var screen = blessed.screen({
  autoPadding: true,
  smartCSR: true
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
  border: {
    type: 'line'
  },
  style: {
    fg: 'yellow',
    border: {
      fg: 'yellow'
    }
  }
});

var content_box = blessed.box({
  width: '100%',
  content: '',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: {
      fg: 'white'
    }
  },
  scrollable: true
});

var post_title = blessed.text({
  width: '100%',
  align: 'center',
  content: 'welcome to imgurizer!',
  style: {
    bold: true,
    fg: 'white',
    //underline: 'white'
  },
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
layout.append(content_box);
content_box.append(post_title);
//content_box.append(title_line);

getGallery(0, function(err, res, body){
  //TODO: handle error
  gallery = JSON.parse(body).data;
  setPost(0);
});

screen.render();

//ai('img.png', function(result){
//  console.log(result);
//});

var num = 0;
var gallery = null;
var page = 0;

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
  post_title.setContent(obj.title);
}
