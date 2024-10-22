var app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x2c3e50
});
document.body.appendChild(app.view);

const gr  = new PIXI.Graphics();
gr.beginFill(0xffffff);
gr.drawCircle(30, 30, 30);
gr.endFill();
app.stage.addChild(gr)
