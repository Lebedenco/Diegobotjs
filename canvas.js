let imgs = [];

module.exports = {
  start: async function(imgs) {
    const {
      createCanvas,
      loadImage
    } = require('canvas')

    this.imgs = imgs;

    const canvas = createCanvas(241, 241)
    const ctx = canvas.getContext('2d')

    for(let i = 0, x = 0, y = -80 ; i < imgs.length ; i++) {
      if (i % 3 === 0) {
        x = 0;
        y += 80;
      }
      
      const image = await loadImage(imgs[i]);
      
      ctx.drawImage(image, x, y, 80, 80);
      ctx.beginPath();
      ctx.moveTo(x + 1, y + 1);
      ctx.lineTo(x + 1, y + 80);
      ctx.lineTo(x + 80, y + 80);
      ctx.lineTo(x + 80, y + 1);
      ctx.lineTo(x + 1, y + 1);
      ctx.strokeStyle = "gray";
      ctx.stroke();

      x += 80;
    }
    return canvas.toBuffer();
  }
}