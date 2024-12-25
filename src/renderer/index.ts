// import '../lib/L2DSDK/live2d.min.js'
// import '../lib/L2DSDK/live2dcubismcore.min.js'
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display'
// import { ipcRenderer } from 'electron'

// 将 PIXI 暴露到 window 上，这样插件就可以通过 window.PIXI.Ticker 来自动更新模型
window.PIXI = PIXI
// const ipcRenderer = window.Electron.ipcRenderer
const ipcManager = window.ipcManager
const el = document.getElementById('live2d_view')
async function init(): Promise<void> {
  const app = new PIXI.Application({
    view: <PIXI.ICanvas>(<unknown>el),
    autoStart: true,
    autoDensity: true,
    resizeTo: window,
    backgroundAlpha: 0
    // width: 400,
    // height: 500
  })
  const model = await Live2DModel.from('/model/Hiyori/Hiyori.model3.json')
  app.stage.addChild(model)

  const scaleX = (innerWidth * 0.6) / model.width
  const scaleY = (innerHeight * 0.8) / model.height
  model.scale.set(Math.min(scaleX, scaleY))
  model.x = -200
  model.y = -70
  // // 交互
  // model.on('hit', (hitAreas) => {
  //   el?.addEventListener('mousedown', (val) => {
  //     if (val.button === 1) {
  //       ipcRenderer.send('set-ignore-mouse-events', false)
  //     }
  //     el.addEventListener('mouseup', () => {
  //       ipcRenderer.send('set-ignore-mouse-events', true, true)
  //     })
  //   })

  //   if (hitAreas.includes('body')) {
  //     model.motion('tap_body')
  //   }
  // })

  setMouseEvents()
  draggable(model)
}
//移动模型
function draggable(model: any): void {
  model.buttonMode = true

  model.on('pointerdown', (e: { globalX: number; globalY: number }) => {
    // el?.addEventListener('mouseenter', () => {
    //   ipcRenderer.send('set-ignore-mouse-events', true, true)
    // })
    // el?.addEventListener('mouseleave', () => {
    //   ipcRenderer.send('set-ignore-mouse-events', false)
    // })
    model.dragging = true
    model._pointerX = e.globalX - model.x
    model._pointerY = e.globalY - model.y
  })
  model.on('pointermove', (e: { globalX: number; globalY: number }) => {
    if (model.dragging) {
      model.position.x = e.globalX - model._pointerX
      model.position.y = e.globalY - model._pointerY
    }
  })
  model.on('pointerupoutside', () => (model.dragging = false))
  model.on('pointerup', () => (model.dragging = false))
}
function setMouseEvents(): void {
  //默认穿透
  // ipcAPI.setIgnoreMouseEvent( true)
  ipcManager.send("set-ignore-mouse-events",true,{forward:true})
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  // document.addEventListener('keydown', (key) => {
  //   if (key.altKey && key.key == 'F1') {
  //     ipcAPI.setIgnoreMouseEvent(false)
  //   }
  // })
  // document.addEventListener('keyup', () => {
  //   ipcAPI.setIgnoreMouseEvent(true)
  // })
  // el?.addEventListener('mouseup', () => {
  //   ipcAPI.setIgnoreMouseEvent(true)
  // })
  // el?.addEventListener('mouseout', () => {
  //   ipcAPI.setIgnoreMouseEvent(true)
  // })
}
init()
