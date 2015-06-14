# ascii-images by [@michalbe](http://github.com/michalbe) #
Convert `.png` images to ASCII characters

### What? ###
This library displays `.png` images in the command line. Example:
 * Image:<br/>
![image](https://raw.githubusercontent.com/michalbe/ascii-images/master/test-image.png)

 * And generated ASCII image:<br/>
![screen](https://raw.githubusercontent.com/michalbe/ascii-images/master/screen.png)

### API ###
This library takes two parameters:
```javascript
AsciiImages('path/to/the/image.png', callback);
```
The only parameter passed to the callback is our image converted to ascii, all we want to do now is display it in commandline, for instance using `console.log`.

### How to use? ###
Install simply with:
```bash```
npm install ascii-images
```

Then in your code:
```javascript
var ai = require('ascii-images');

ai('test-image.png', function(result){
  console.log(result);
});

```

### How it works? ###
When the image is passed to the library, it uses [PNG-JS](https://www.npmjs.org/package/png-js) to decode pixel values from it (like `getImageData()` on [HTML5 canvas](https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D#getImageData%28%29)), and width of the image using [image-size](https://www.npmjs.org/package/image-size) package. Then it iterates through the array of pixels and change them to [8-bit Xterm](http://en.wikipedia.org/wiki/256_colors) color numbers using [color2xterm](https://www.npmjs.org/package/color2xterm) library. Then everything is coloured using [cli-color](https://www.npmjs.org/package/cli-color) library.

### Limitations ###
  * `PNG-JS` works only with `.png` files
  * `xTerm colors` are _'Not supported on Windows and some terminals. However if used in not supported environment, the closest color from basic (16 colors) palette is chosen'_ - quote form `cli-color` lib.
