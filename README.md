# canvio
Simple JS canvas library

canvio is intended to address the problem that the Canvas API is less than simple, and not particularly intuitive. I
wanted to be able to have the canvas just *do* something when I asked it to, instead of requiring 23 other calls along
with it.

I may exaggerate. Slightly.

-----

## Basic Functionality
### Images
The `canvio.Image` type provides functionality for using or generating images on the canvas.

**Retrieving and displaying an external image:**

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var img = new canvio.Image();
    img.init(ctx, 600, 300);
    img.setSource("https://placehold.it/600x300");

**Generating an image based on RGBA patterns:**

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var img = new canvio.Image();
    img.init(ctx, 600, 600);

    function red(x, y) {
      return 255 * Math.sin(x);
    }

    function green(x, y) {
      return 255 * Math.cos(x);
    }

    function blue(x, y) {
      return 255 * Math.sin(x + y);
    }

    function alpha(x, y) {
      return 255;
    }

    img.setPattern(red, green, blue, alpha);

### Turtle
The `canvio.Turtle` class is a mimic of Python's turtle functionality. The analogy is that you have a pen (a "turtle")
which starts at the center of the canvas, and which you can give instructions like `forward(100)`, `left(45)`, and so on.

**Drawing a square:**

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var t = new canvio.Turtle(ctx);

    for (var i = 0; i < 4; i++) {
      t.forward(100);
      t.right(90);
    }

**Drawing a circle:**

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var t = new canvio.Turtle(ctx);

    for (var i = 0; i < 360; i++) {
      t.forward(1);
      t.right(1);
    }

### Canvas API
There's also a simplified version of the Canvas API in canvio, which enables you to perform basic canvas operations in
a much simpler fashion.
