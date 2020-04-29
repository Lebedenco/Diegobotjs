module.exports = {
  analise: async function (...img) {
    const {
      createCanvas,
      loadImage
    } = require('canvas')

    const canvas = createCanvas(128, 128);
    const ctx = canvas.getContext('2d');

    let image = await loadImage(img[0]);

    ctx.drawImage(image, 0, 0, 128, 128);

    image = await loadImage(img[1]);

    ctx.drawImage(image, 10, 10, 128, 128);

    return canvas.toBuffer();
  },

  addText: async function (img, text, color) {
    const {
      createCanvas,
      loadImage
    } = require('canvas');

    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');

    const image = await loadImage(img);

    ctx.drawImage(image, 0, 0, 512, 512);

    ctx.font = '50px Impact';
    ctx.fillStyle = '#ffffff';

    if (color) {
      ctx.fillStyle = color;
    }

    const tam = ctx.measureText(text);

    console.log(tam);

    if (tam.width >= 512 / 2 - tam.width / 2) {
      ctx.font = '30px Impact';
    }

    ctx.fillText(text, 512 / 2 - tam.width / 2, 500);

    return canvas.toBuffer();
  },

  load: async (dataurl) => {
    const {
      createCanvas,
      loadImage
    } = require('canvas');

    const canvas = createCanvas(241, 241);
    const ctx = canvas.getContext('2d');

    console.log('Starting loading image...');

    const image = await loadImage(dataurl);

    console.log('Finished loading image...');

    ctx.drawImage(image, 0, 0, 241, 241);

    return canvas.toBuffer();
  }
}