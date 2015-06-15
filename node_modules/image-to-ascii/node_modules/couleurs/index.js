// Dependencies
var x256 = require("x256")

// Constants
const map = {
    bold:           [ "\u001b[1m", "\u001b[22m" ]
  , italic:         [ "\u001b[3m", "\u001b[23m" ]
  , underline:      [ "\u001b[4m", "\u001b[24m" ]
  , inverse:        [ "\u001b[7m", "\u001b[27m" ]
  , strikethrough:  [ "\u001b[9m", "\u001b[29m" ]
};

/**!
 * hexToRgb
 * Converts a hex color code to rgb
 *
 * @name hexToRgb
 * @function
 * @param {String} hex The hex color value.
 * @return {Array|null} An array containing `r`, `g`, `b` values. If the input is invalid, `null` will be returned.
 */
function hexToRgb (hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

/**
 * Couleurs
 *
 * @name Couleurs
 * @function
 * @param {Boolean|undefined} setStringProto If `true`, the prototype of String class will be modified.
 * @return {Object} An object containing the following methods:
 *
 *  - `rgb`
 *  - `bold`
 *  - `italic`
 *  - `underline`
 *  - `inverse`
 *  - `strikethrough`
 *
 */
module.exports = function (setStringProto) {

    /**
     * fg
     * Sets the foreground color.
     *
     * @name fg
     * @function
     * @param {String} str The input string.
     * @param {String|Array|Number} r If number, it will be the red value from RGB.
     * If array, it should be an array of three numbers representing RGB values.
     * If String, it will be interpreted as HEX color.
     * @param {Number} g Green value
     * @param {Number} b Blue value
     * @return {String} Colored string
     */
    function fg(str, r, g, b) {
        if (r[0] === "#") {
            return fg.call(this, str, hexToRgb(r));
        }

        return "\u001b[38;5;" + x256(r, g, b) + "m" + str + "\033[0m";
    }

    /**
     * bg
     * Sets the background color.
     *
     * @name bg
     * @function
     * @param {String} str The input string.
     * @param {String|Array|Number} r If number, it will be the red value from RGB.
     * If array, it should be an array of three numbers representing RGB values.
     * If String, it will be interpreted as HEX color.
     * @param {Number} g Green value
     * @param {Number} b Blue value
     * @return {String} Colored string
     */
    function bg(str, r, g, b) {
        if (r[0] === "#") {
            return bg.call(this, str, hexToRgb(r));
        }

        return "\u001b[48;5;" + x256(r, g, b) + "m" + str + "\033[0m";
    }

    // Build couleurs object
    var couleurs = {
        fg: fg
      , bg: bg
    };

    for (var key in map) {
        (function (style, styleId) {
            couleurs[styleId] = function (str) {
                return style[0] + str + style[1];
            };
        })(map[key], key)
    }

    // Modify String prototype
    if (setStringProto === true) {
        for (var meth in couleurs) {
            (function (meth, func) {
                String.prototype[meth] = function (r, g, b) {
                    return func.call(this, String(this), r, g, b);
                };
            })(meth, couleurs[meth]);
        }
    }

    return couleurs;
};
