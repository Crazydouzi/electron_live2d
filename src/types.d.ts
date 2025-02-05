import { ElectronAPI } from '@electron-toolkit/preload'
import { IgnoreMouseEventsOptions } from 'electron'
import * as PIXI from 'pixi.js'
import { Handler } from '@main/extension/ipcManager'
type PIXI = typeof PIXI
declare global {
  interface Window {
    ipcManager: {
      send: <K extends IpcEventsKeys>(event: K, ...args: Parameters<IpcEvents[K]>) => void,
      on: <K extends IpcEventsKeys>(channel: K, listener: Handler<K>) => () => any,
      handle:<K extends IpcEventsKeys>(event:K)=>any
    },
    PIXI: PIXI,
    api: unknown
  }


}
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
export interface IpcEvents {
  'set-ignore-mouse-events': (arg: boolean, options?: IgnoreMouseEventsOptions) => void
  'set-always-on-Top': (arg: boolean) => void
  'set-live2d-visible': (arg: boolean) => void
  'get-model-list': () => string
}

export type IpcEventsKeys = keyof IpcEvents
