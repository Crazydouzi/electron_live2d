import '../lib/L2DSDK/live2d.min.js'
import '../lib/L2DSDK/live2dcubismcore.min.js'
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display'

// 将 PIXI 暴露到 window 上，这样插件就可以通过 window.PIXI.Ticker 来自动更新模型
window.PIXI = PIXI;

async function init(): Promise<void> {
  const app = new PIXI.Application({
    view: <PIXI.ICanvas>(<unknown>document.getElementById('live2d_view')),
    autoStart: true,
    autoDensity: true,
    resizeTo: window,
    backgroundAlpha:0
  })
  const model = await Live2DModel.from('../model/Hiyori/Hiyori.model3.json')

  app.stage.addChild(model)

  const scaleX = (innerWidth * 1) / model.width;
  const scaleY = (innerHeight * 1) / model.height;
  // 变换
  // model.x = 10
  // model.y = innerHeight * 0.1;
  // model.rotation = Math.PI
  // model.skew.x = Math.PI
  console.log(scaleX)
  model.scale.set(Math.min(scaleX, scaleY));
  // model.anchor.set(0.5, 0.5)

  // 交互
  model.on('hit', (hitAreas) => {
    if (hitAreas.includes('body')) {
      model.motion('tap_body')
    }
  })
  draggable(model)
}
function draggable(model) {
  model.buttonMode = true;
  model.on("pointerdown", (e) => {
    model.dragging = true;
    model._pointerX = e.data.global.x - model.x;
    model._pointerY = e.data.global.y - model.y;
  });
  model.on("pointermove", (e) => {
    if (model.dragging) {
      model.position.x = e.data.global.x - model._pointerX;
      model.position.y = e.data.global.y - model._pointerY;
    }
  });
  model.on("pointerupoutside", () => (model.dragging = false));
  model.on("pointerup", () => (model.dragging = false));
}
init()
