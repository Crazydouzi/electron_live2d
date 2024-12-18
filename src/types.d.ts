import { ElectronAPI } from '@electron-toolkit/preload'
import { IgnoreMouseEventsOptions } from 'electron'
import * as PIXI from 'pixi.js'
type PIXI=typeof PIXI
declare global {
  interface Window {
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
