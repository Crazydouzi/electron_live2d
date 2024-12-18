import { ElectronAPI } from '@electron-toolkit/preload'
import { IgnoreMouseEventsOptions } from 'electron'
import * as PIXI from 'pixi.js'
import { IPCManager } from '@main/extension/ipcManager'
type PIXI=typeof PIXI
declare global {
  interface Window {
    ipcManager:{
      send:<K extends IPCManager.EventsKeys>(event: K, ...args: Parameters<IPCManager.Events[K]>)=>void,
      on: <K extends IPCManager.EventsKeys>(channel: K, listener: IPCManager.Handler<K>)=>()=>any
    },
    electronAPI: IElectronAPI,
    PIXI: PIXI,
    electron: ElectronAPI
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
export interface IElectronAPI {
  setIgnoreMouseEvent: ( arg: boolean, options?: IgnoreMouseEventsOptions) => void
}
