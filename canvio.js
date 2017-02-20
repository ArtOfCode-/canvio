window.canvio = {};

canvio.Image = function() {
  var ctx, imageData;

  function checkWH(obj) {
    if (obj && obj.height && obj.width) {
      return true;
    }
    else {
      throw new Error("init() not called on new canvio.Image object");
    }
  }

  function setPixel(image, x, y, r, g, b, a) {
    var index = ((y * image.width) + x) * 4;
    image.data[index + 0] = r;
    image.data[index + 1] = g;
    image.data[index + 2] = b;
    image.data[index + 3] = a;
  }

  return {
    init: function(context, width, height) {
      this.height = height;
      this.width = width;
      ctx = context;
      imageData = ctx.createImageData(width, height);
    },

    setPattern: function(red, green, blue, alpha) {
      checkWH(this);
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          setPixel(imageData, x, y, red.call(this, x, y), green.call(this, x, y), blue.call(this, x, y), alpha.call(this, x, y));
        }
      }
      ctx.putImageData(imageData, 0, 0);
    },

    setSource: function(url) {
      var img = new Image();
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
      };
      img.src = url;
    }
  };
};

canvio.Turtle = function(context) {
  var ctx = context;
  var color = "black";
  var penState = "down";

  var pos = {
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2
  };

  var heading = 0;

  function rad(deg) {
    return deg * (Math.PI / 180);
  }

  function tox(hdg) {
    return ((hdg + 90) % 360) - 180;
  }

  function dx(tx, d) {
    return d * Math.cos(rad(tx));
  }

  function dy(tx, d) {
    return d * Math.sin(rad(tx));
  }

  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);

  return {
    penDown: function() {
      penState = "down";
    },

    penUp: function() {
      penState = "up";
    },

    forward: function(amount) {
      pos.x += dx(tox(heading), amount);
      pos.y += dy(tox(heading), amount);
      if (penState == "down") {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
      else {
        ctx.moveTo(pos.x, pos.y);
      }
    },

    backward: function(amount) {
      this.forward(-amount);
    },

    left: function(turn) {
      heading = (heading + (360 - turn)) % 360;
    },

    right: function(turn) {
      heading = (heading + turn) % 360;
    }
  };
};
