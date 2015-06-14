'use strict';

// Dependencies
var PNG = require('png-js');
var rgb2xterm = require('color2xterm').rgb2xterm;
var sizeOf = require('image-size');
var clc = require('cli-color');

// I used spaces to generate the image because only background will be colored
var sign = '  ';

var asciiImages = function(imageUrl, callback) {
  // Declaration of empty string for our result
  var result = '';
  // Decode all the pixels from the .png image
  PNG.decode(imageUrl, function(pixels) {
    // What is the width of the image?
    var width = sizeOf(imageUrl).width;
    // Iterate thru the pixels, since the array is 1d, every pixel is described
    // using 4 elements ([R, G, B, Alpha, R, G, B, Alpha, ...]), so loop index
    // is incremented by 4
    for(var i=0, l=pixels.length; i<l; i+=4) {
      // What is the xTerm equivalent of this color?
      var c = rgb2xterm(pixels[i], pixels[i+1], pixels[i+2]);
      // Generate colored element
      result += clc.bgXterm(c)(sign);
      // If we reached end of the line, break it and start from the beginning
      // again
      if ((i+4)%((4*width)) === 0) {
        result += '\n';
      }
    }
    // Return the result to the callback
    callback(result);
  });
};

module.exports = asciiImages;
