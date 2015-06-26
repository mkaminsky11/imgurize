#! /usr/bin/env node

//TODO: loading bar!
//highlight links? [-NO-]
//TODO: gallery search (s) [DONE!]
//TODO: user search (a) [DONE!]
//TODO: newest? (u) [DONE!]
//TODO: back to gallery (g) [DONE!]
//TODO: help (h) [DONE!]
//TODO: convert to actual shell program [DONE!]

/**
* DEPENDENCIES
**/

var real_image = (process.argv.indexOf("-i") !== -1);
console.log(real_image);

var blessed = require('blessed'); //graphics
var request = require('request'); //http
var ImageToAscii = require("image-to-ascii"); //to ascii
var colors = require('colors'); //colorize things
var program = blessed.program();

var num = 0;            //gallery index
var gallery = null;     //the gallery array
var album = null;       //the album boolean
var album_content = []; //album content array
var user = null;        //user name
var page = 0;           //the page number
var scroll = 0;         //scroll line
var per_page = 30;      //how many per page?
var image_count = null; //how many images per album?
var image_cutoff = 10;  //don't display more than this
var comment_cutoff = 15;//don't show more comments than this
var curr = [];          //current id's
var comments = null;    //comment array
var _section = "hot";   //section hot|usersub
var _sort = "viral";    //sorting viral|time
var user_mode = false;  //viewing a user?
var _user = null;       //user name
var search_mode = false;//is a search?
var _search = null;     //search query
var table = null;       //help table
var monthNames = ["January", "February", "March","April", "May", "June", "July","August", "September", "October","November", "December"]; //for datetime

/**
* BASIC ELEMENTS
**/

var screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  dockBorders: true
});
screen.title = "imgurize";

var layout = blessed.layout({
  width: '100%',
  height: '100%'
});

var title_text = blessed.text({
  width: '100%',
  align: 'center',
  content: ("imgurize | " + "gallery".white),
  style: {
    fg: 'black',
    bg: '#2ECC71'
  }
});

var post_text = blessed.text({
  width: '100%',
  align: 'center',
  content: 'imgurize',
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

var post_info = blessed.text({
  width: '100%',
  align: 'center',
  content: 'press \"h\" for help!',
  border: {
    type: 'line'
  },
  style: {
    fg: '#eee',
    border: {
      fg: '#eee'
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

var post_box = blessed.layout({
  content: '',
  width: '100%',
  height: 'shrink',
  style: {
    fg: 'white',
    border: {
      fg: 'white'
    }
  },
  scrollable: true,
  alwaysScroll: true
});

screen.append(layout);
layout.append(title_text);
layout.append(post_text);
layout.append(post_info);
layout.append(content_box);
content_box.append(post_box);

/**
* INIT
**/
init();

screen.render();

function getGallery(page, callback){
  if(user_mode === false && search_mode === false){
    request({
      url: ("https://api.imgur.com/3/gallery/"+_section+"/"+_sort+"/0.json?page=" + page),
      headers: {
        "Authorization": "Client-ID 0b4d9e43c145774"
      }
    }, callback);
    //as a test
    //callback(null, null, "{\"data\":[]}");
  }
  else if(user_mode === false && search_mode === true){
    //search mode!
    getSearchImages(page, callback);
  }
  else{
    //if user_mode, get from user submissions to gallery
    getUserImages(page, callback);
  }
};

function getComments(id,album,callback){
  var type = "image";
  if(album){type="album"}
  var url = "https://api.imgur.com/3/"+type+"/"+id+"/comments";
  request({
    url: url,
    headers: {
      "Authorization": "Client-ID 0b4d9e43c145774"
    }
  }, callback);
};

function getUser(userName, callback){ //user info
  request({
    url: "https://api.imgur.com/3/account/"+userName,
    headers: {
      "Authorization": "Client-ID 0b4d9e43c145774"
    }
  }, callback);
}

function getSearchImages(page, callback){
  request({
    url: "https://api.imgur.com/3/gallery/search/viral/" + page + "?q=" + encodeURIComponent(_search),
    headers: {
      "Authorization": "Client-ID 0b4d9e43c145774"
    }
  }, callback);
};

function getUserImages(page, callback){
  request({
    url: "https://api.imgur.com/3/account/"+_user+"/submissions/0.json?page=" + page + "&perPage=" + per_page,
    headers: {
      "Authorization": "Client-ID 0b4d9e43c145774"
    }
  }, callback);
};

function getAlbum(albumId, page, callback){
  request({
    url: "https://api.imgur.com/3/album/"+albumId+"/images/0.json?page=" + page + "&perPage=" + per_page,
    headers: {
      "Authorization": "Client-ID 0b4d9e43c145774"
    }
  }, callback);
};

function setPost(num){
  var obj = gallery[num];
  if(obj.title){
    var info = ""
    if(obj.account_url){
      info =  "by " + obj.account_url.blue;
    }
    var date = new Date(0);
    date.setUTCSeconds(obj.datetime);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    info += " on " + (day + "/" + monthNames[monthIndex] + "/" + year).yellow;
    info += " " + String(obj.ups).green + " " + String(obj.downs).red;
    info += " " + obj.comment_count + " comments";
    post_text.setContent(obj.title);
    post_info.setContent(info);
  }
  else{
    post_text.setContent("no title");
  }
  clearContent();
  if(obj.is_album !== true){
    curr = [obj.id];
    addPost(obj);
  }
  else{
    image_count = obj.image_count;
    album_content = [];
    try{
      album_content = new Array(Math.min(obj.images_count, image_cutoff) + 1);
    }
    catch(e){
    }
    var album_id = obj.link.split("/").reverse()[0];
    curr = [obj.id];
    getAlbum(album_id, 0, function(err, res, body){
      formatComments(album_id, true);
      if(curr[0] === obj.id){
        var the_album = JSON.parse(body).data;
        //get all descs and stuff from link
        for(var i = 0; i < the_album.length; i++){
          curr.push(the_album[i].id);
          addAlbumPost(i, the_album[i]);
        }
      }
    });
    screen.render();
  }
}

screen.key('down', function(ch, key) {
    scroll+=1;
    setScroll();
});
screen.key('up', function(ch, key) {
    scroll-=1;
    setScroll();
});
screen.key('left', function(ch, key) {
  if(gallery !== null && gallery.length > 0){
    if(num === 0){
      if(page === 0){
        //can't go back
      }
      else{
        page--;
        getGallery(page, function(err, res, body){
          //TODO: handle error
          var json = JSON.parse(body).data;
          if(!err && json.length > 0){
            gallery = json;
            num = gallery.length - 1;
            setPost(num);
          }
          else{
          }
        });
      }
    }
    else{
      num--;
      setPost(num);
    }
  }
});

screen.key('right', function(ch, key) {
  if(gallery !== null && gallery.length > 0){
    if(num === (gallery.length - 1)){
      page++;
      num = 0;
      getGallery(page, function(err, res, body){
        //TODO: handle error
        var json = JSON.parse(body).data;
        if(!err && json.length > 0){
          gallery = json;
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
  }
});

screen.key('u', function(ch, key){
  title_text.setContent("imgurize | " + "usersub/newest".white);
  user_mode = false;
  search_mode = false;
  //user-sub
  _section = "user";
  _sort = "time";
  page = 0;
  num = 0;
  init();
});

screen.key('g', function(ch, key){
  title_text.setContent("imgurize | " + "gallery".white);
  user_mode = false;
  search_mode = false;
  _section = "hot";
  _sort = "viral";
  page = 0;
  num = 0;
  init();
});

screen.key('h', function(ch, key){
  post_box.setContent("");
  table = blessed.table({
    parent: post_box,
    border: 'line',
    align: 'center',
    tags: true,
    style: {
      border: {
        fg: 'white'
      },
      header: {
        fg: 'blue',
        bold: true
      },
      cell: {
        fg: 'magenta'
      }
    }
  });

  table.setData([
    ["Key".bold.underline.blue, "Command".bold.underline.blue],
    ["s".green, "search"],
    ["a".red, "account search"],
    ["u".yellow, "user submissions"],
    ["g".blue, "gallery"]
  ]);
  screen.render();
});

screen.key('a', function(ch, key){
  var prompt = blessed.prompt({
    vi: true,
    keys: true
  });

  screen.append(prompt);
  prompt.input("Search for a user","", function(err, value){
    getUser(value, function(err, res, body){
      if(JSON.parse(body).success === true){
        user_mode = true;
        search_mode = false;
        _user = value;
        title_text.setContent("imgurize | " + ("user:" + _user).white);
        init();
      }
      else{
        title_text.setContent("imgurize | " + "user not found!".white);
      }
    });

    screen.remove(prompt);
    screen.render();
  });
});

screen.key('s', function(ch, key){
  var prompt = blessed.prompt({
    vi: true,
    keys: true
  });

  screen.append(prompt);
  prompt.input("Input search term","", function(err, value){
    user_mode = false;
    search_mode = true;
    _search = value;
    title_text.setContent("imgurize | " + ("search: " + _search).white);
    init();

    screen.remove(prompt);
    screen.render();
  });
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

function clearContent(){
  post_box.setContent("");
  if(table !== null){
    post_box.remove(table);
  }
}

function addPost(obj){
  ImageToAscii(obj.link, function(err, converted) {
    if(curr.indexOf(obj.id) !== -1){
      if(converted){post_box.pushLine(converted);}
      else{post_box.pushLine("error loading content:" + err);}

      if(err){post_box.pushLine(err)}

      if(obj.description){  post_box.pushLine(obj.description);}

      formatComments(obj.id, false);
      scroll = 0;
      setScroll();
      screen.render();
    }
  });
}

function addAlbumPost(index, obj){
  ImageToAscii(obj.link, function(err, converted) {
    if(curr.indexOf(obj.id) !== -1){
      if(converted){}
      else{converted = "error loading content:" + err;}

      if(obj.description){}
      else{obj.description = "";}
      album_content[index] = converted + obj.description + "\n";
      post_box.setContent(album_content.join("\n"));
      scroll = 0;
      setScroll();
      screen.render();
    }
  });
}

function setScroll(){
  post_box.scrollTo(scroll);
  screen.render();
}

function formatComments(id, album){
  getComments(id, album, function(err, res, body){
    comments = JSON.parse(body).data;
    if(comments.length > comment_cutoff){
      comments = comments.slice(0, comment_cutoff);
    }

    var res = "\n\n" + "Comments".bold.underline.blue + "\n";
    for(var i = 0; i < comments.length; i++){
      var the_comment = "| " + comments[i].author.yellow + " " + String(comments[i].ups).green + " " + String(comments[i].downs).red + " " + comments[i].children.length + " replies";
      the_comment += "\n+-" + comments[i].comment + "\n|\n";
      res += the_comment;
    }
    if(album){
      if(curr.indexOf(id) !== -1){
        album_content[album_content.length - 1] = res;
        post_box.setContent(album_content.join("\n"));
        scroll = 0;
        setScroll();
        screen.render();
      }
    }
    else{
      if(curr.indexOf(id) !== -1){
        post_box.pushLine(res);
      }
    }
  });
}

function init(){
  getGallery(0, function(err, res, body){
      //try{
        var json = JSON.parse(body).data;
        if(!err){
          gallery = json;
          if(json.length > 0){
            setPost(0);
          }
          else{
            post_box.setContent("No posts found!");
            post_text.setContent("No posts found!");
          }
        }
        else{
          title_text.setContent("error!")
        }
      //}
      //catch(e){
      //  console.log(e);
      //}
  });
}
