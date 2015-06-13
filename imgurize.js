//0b4d9e43c145774
//74542f2b794fdb874d9d790de40dccf7bb09a8da
var blessed = require('blessed');
var fs = require('fs');
var pictureTube = require('picture-tube')
var tube = pictureTube();
tube.pipe(process.stdout);

//imgurize.width = process.stdout.getWindowSize()[0];
//imgurize.height = process.stdout.getWindowSize()[1];
var screen = blessed.screen({
  autoPadding: true,
  smartCSR: true
});
screen.title = "imgurizer";

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
  }
});

screen.append(content_box);
screen.append(title_text);

screen.render();

//fs.createReadStream('img.png').pipe(tube);

var imgurize = {

};

function getGallery(){
  //https://api.imgur.com/3/gallery.json
};
