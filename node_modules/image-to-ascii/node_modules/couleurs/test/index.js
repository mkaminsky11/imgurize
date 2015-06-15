// Dependency
var Couleurs = require("../index")();

// No prototype modify
console.log(Couleurs.fg("Red", [255, 0, 0]));
console.log(Couleurs.fg("Yellow", 255, 255, 0));
console.log(Couleurs.fg("Blue", "#2980b9"));
console.log(Couleurs.bg("Blue Background", "#2980b9"));

console.log(Couleurs.bold("Bold"));
console.log(Couleurs.italic("Italic"));

// Modify prototype
require("../index")(true);

console.log("Underline".underline());
console.log("Inverse".inverse());
console.log("Strikethrough".strikethrough());

console.log("All combined"
    .fg("#d35400")
    .bold()
    .italic()
    .underline()
    .inverse()
    .strikethrough()
);
