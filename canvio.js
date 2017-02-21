/**
 * canvio.js - the simple canvas library
 *
 * Copyright (c) ArtOfCode 2017
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * A note about positions.
 * Anywhere this library requires a 'position object', all that is is an object with x and y fields, such as
 * {x: 100, y: 250}. This means that if you want to create your own positions, you can do that, but this format is also
 * compatible with the canvio.Position type.
 */

/**
 * The canvio global object.
 *
 * @author ArtOfCode
 */
window.canvio = {};
var canvio = window.canvio;

/**
 * Draws a line from the point at start to the point at end.
 *
 * @param ctx   a CanvasRenderingContext2D object, such as that returned by HTMLCanvasElement.getContext("2d")
 * @param start a position object representing the start of the line to be drawn
 * @param end   a position object representing the end of the line to be drawn
 */
canvio.drawLine = function(ctx, start, end) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.closePath();
};

/**
 * Sets the color to use for outlines (strokes) of drawings on this canvas. Will apply from the point at which
 * this method is called until the next point it is called. This method can also be overridden by setting
 * CanvasRenderingContext2D.strokeStyle.
 *
 * @param ctx   a CanvasRenderingContext2D object
 * @param color the color to use for future outlines. Must be a hex color code or recognized HTML color name.
 */
canvio.setOutlineColor = function(ctx, color) {
  ctx.strokeStyle = color;
};

/**
 * Sets the color to use for fills of drawings on this canvas. Can be overridden by setting
 * CanvasRenderingContext2D.fillStyle.
 *
 * @param ctx   a CanvasRenderingContext2D object
 * @param color the color to use for fills. Must be a hex color code or recognized HTML color name.
 */
canvio.setFillColor = function(ctx, color) {
  ctx.fillStyle = color;
};

/**
 * Draws a circle on the canvas with the given center point and radius.
 *
 * @param ctx    a CanvasRenderingContext2D object
 * @param center a position object representing the center of the circle to be drawn
 * @param radius a number providing the radius of the circle
 */
canvio.drawCircle = function(ctx, center, radius) {
  ctx.ellipse(center.x, center.y, radius, radius, 0, 0, 2 * Math.PI);
};

/**
 * A type representing a co-ordinate based position on the canvas. This uses canvas co-ordinates, which start at (0, 0)
 * at the top-left of the canvas. X increases as you move right, and Y increases as you move down.
 *
 * @param x the position on the x-axis represented by this object
 * @param y the position on the y-axes represented by this object
 */
canvio.Position = function(x, y) {
  var xPos = x;
  var yPos = y;

  return {
    x: xPos,
    y: yPos,

    /**
     * Calculates the distance between this point and another point.
     *
     * @param  other a position object representing the point to calculate distance to
     * @return the distance between the two points
     */
    distanceTo: function(other) {
      return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    },

    /**
     * A convenience method, calculating the distance to the origin (0, 0) of the canvas. Effectively an overload of
     * distanceTo.
     *
     * @return the distance between this point and the origin of the canvas
     */
    distanceToOrigin: function() {
      return this.distanceTo({x: 0, y: 0});
    }
  };
};

/**
 * A type providing functionality for working with images on the canvas, either remotely-sourced or pattern-generated.
 */
canvio.Image = function() {
  var ctx;
  var imageData;

  function checkWH(obj) {
    if (obj && obj.height && obj.width) {
      return true;
    }
    throw new Error('init() not called on new canvio.Image object');
  }

  function setPixel(image, x, y, r, g, b, a) {
    var index = ((y * image.width) + x) * 4;
    image.data[index + 0] = r;
    image.data[index + 1] = g;
    image.data[index + 2] = b;
    image.data[index + 3] = a;
  }

  return {
    /**
     * Initialises this instance with a canvas context, width, and height.
     *
     * @param context a CanvasRenderingContext2D object
     * @param width the width of the image to be loaded
     * @param height the height of the image to be loaded
     */
    init: function(context, width, height) {
      this.height = height;
      this.width = width;
      ctx = context;
      imageData = ctx.createImageData(width, height);
    },

    /**
     * Displays an image on the canvas constructed pixel-by-pixel based on X-Y RGBA functions.
     *
     * @param red   a function that returns the amount of red in a given (x, y) pixel
     * @param green a function that returns the amount of green in a given (x, y) pixel
     * @param blue  a function that returns the amount of blue in a given (x, y) pixel
     * @param alpha a function that returns the amount of alpha (transparency) in a given (x, y) pixel
     */
    setPattern: function(red, green, blue, alpha) {
      checkWH(this);
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          setPixel(imageData, x, y, red.call(this, x, y), green.call(this, x, y), blue.call(this, x, y), alpha.call(this, x, y));
        }
      }
      ctx.putImageData(imageData, 0, 0);
    },

    /**
     * Loads and displays an image from a remote URL.
     *
     * @param url the URL to load image data from
     */
    setSource: function(url) {
      var img = new Image();
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
      };
      img.src = url;
    }
  };
};

/**
 * A type providing turtle operations, mimicking Python's turtle module.
 *
 * @param context a CanvasRenderingContext2D object
 */
canvio.Turtle = function(context) {
  var ctx = context;
  var penState = 'down';

  var pos = {
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2
  };

  var heading = 0;

  // Converts from degrees to radians, because the Math trig functions work on radians.
  function rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Calculates an angle to the x-axis based on a heading (i.e. angle from the Y axis). Yes, this formula does work.
  // Graph it. y = mod(x + 90, 360) - 180
  function tox(hdg) {
    return ((hdg + 90) % 360) - 180;
  }

  // Calculates the change in x position for a movement of d units and angle tx to the X axis.
  function dx(tx, d) {
    return d * Math.cos(rad(tx));
  }

  // Calculates the change in y position for a movement of d units and angle tx to the X axis.
  function dy(tx, d) {
    return d * Math.sin(rad(tx));
  }

  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);

  return {
    /**
     * Puts the virtual pen down - that is, any movements will now cause lines to be drawn.
     */
    penDown: function() {
      penState = 'down';
    },

    /**
     * Pulls the virtual pen up - any subsequent movements will be invisible.
     */
    penUp: function() {
      penState = 'up';
    },

    /**
     * Moves the turtle forward.
     *
     * @param amount the amount in pixels to move by
     */
    forward: function(amount) {
      pos.x += dx(tox(heading), amount);
      pos.y += dy(tox(heading), amount);
      if (penState === 'down') {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
      else {
        ctx.moveTo(pos.x, pos.y);
      }
    },

    /**
     * Moves the turtle backward.
     *
     * @param amount the amount in pixels to move by.
     */
    backward: function(amount) {
      this.forward(-amount);
    },

    /**
     * Turns the turtle left (anti-clockwise).
     *
     * @param turn the number of degrees to turn
     */
    left: function(turn) {
      heading = (heading + (360 - turn)) % 360;
    },

    /**
     * Turns the turtle right (clockwise).
     *
     * @param turn the number of degrees to turn
     */
    right: function(turn) {
      heading = (heading + turn) % 360;
    },

    /**
     * Sets the color of lines the turtle leaves behind.
     *
     * @param newColor the color to apply to subsequent lines
     */
    setColor: function(newColor) {
      ctx.strokeStyle = newColor;
    },

    /**
     * Sets the width of lines the turtle leaves behind.
     *
     * @param newWidth the width to apply to subsequent lines
     */
    setLineWidth: function(newWidth) {
      ctx.lineWidth = newWidth;
    },

    /**
     * Moves the turtle to a new location without leaving a trail behind, regardless of pen state.
     *
     * @param pos a position object containing co-ordinates to move to
     */
    goTo: function(pos) {
      ctx.moveTo(pos.x, pos.y);
    }
  };
};
