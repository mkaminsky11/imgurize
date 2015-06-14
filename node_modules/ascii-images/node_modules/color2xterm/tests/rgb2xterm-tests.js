'use strict';

var assert = require('assert');
var rgb2xterm = require('../').rgb2xterm;
var hex2xterm = require('../').hex2xterm;

// White colors should be equal 15
// HEX
assert.equal(hex2xterm('#FFFFFF'), 15);

// HEX without `#`
assert.equal(hex2xterm('FFFFFF'), 15);

// RGB
assert.equal(rgb2xterm(255, 255, 255), 15);

// If the color is not in the table we should take the closest color we have
// Like '#0DADD6' -> '#00AFD7' -> 38
assert.equal(hex2xterm('#0DADD6'), 38);
