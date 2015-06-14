# color2xterm by [@michalbe](http://github.com/michalbe) #
Change hex or rgb color to xterm (8-bit) color.

### What? ###
Change hex or rgb color to [xterm](http://en.wikipedia.org/wiki/Xterm) colors (one of the 256 basic [8-bit colors](http://en.wikipedia.org/wiki/256_colors)). Code is based on Python [colortrans.py](https://gist.github.com/MicahElliott/719710) script by [Micah Elliott](https://github.com/MicahElliott).

### API ###
This library has only two methods:
  * __hex2xterm(hex_color)__:
convert given hex color (with or without `#` sign) to the xterm color. If there is no exact match, search for the closest one.
  * __rgb2xterm(r, g, b)__:
convert given rgb color (passed tot he method as 3 separate parameters) to the xterm color. If there is no exact match, search for the closest one.

### How to use? ###
Install simply with:
```bash```
npm install color2xterm
```

Then in your code:
```javascript
var c2xterm = require('color2xterm');

c2xterm.hex2xterm('#ffffff'); // result: 15
c2xterm.rgb2xterm(255, 255, 255); // result: 15

// Find closest color:
c2xterm.hex2xterm('#0DADD6'); // closest color is #00AFD7 so the result is 38

```

### Color table ###
![colors](http://upload.wikimedia.org/wikipedia/en/1/15/Xterm_256color_chart.svg)
_stolen from Wikimedia_
