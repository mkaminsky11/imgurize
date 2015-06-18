# imgurize
an Imgur browser in the terminal, with images converted into colored ascii art!

```shell
sudo npm install -g imgurize #install
imgurize #run
```

### How to Use
+ `left/right` move between posts
+ `up/down` scroll
+ `g` switch to gallery
+ `u` switch to user sub
+ `a` view images of user
+ `s` gallery search
+ `h` help!

### Dependencies
+ [graphicsmagick](http://www.graphicsmagick.org/)
  + `brew install graphicsmagick` (Mac)
  + `sudo apt-get install graphicsmagick` (Ubuntu)
  + `choco install graphicsmagick` (Windows)
+ [node.js](https://nodejs.org/) (tested on `v12.02`)

### Features
+ gallery (viral sorted by hot)
+ user-sub (sorted by time)
+ user search
+ general search
+ view comments
+ general post info

### License
The MIT License (MIT)
 
Copyright (c) 2015 Michael Kaminsky

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.