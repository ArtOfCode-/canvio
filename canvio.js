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
      var img = document.createElement("image");
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
      };
      img.src = url;
    }
  };
}
