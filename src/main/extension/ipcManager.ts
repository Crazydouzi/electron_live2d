import { ipcMain,IpcMainEvent, IpcRendererEvent, webContents } from 'electron'

import { IpcEvents, IpcEventsKeys } from '../../types'

export type Handler<K extends keyof IpcEvents> = (e: IpcMainEvent | IpcRendererEvent, ...args: Parameters<IpcEvents[K]>[]) => void

export interface IpcManager {
  handlers: { [K in IpcEventsKeys]?: Handler<K>[] }
  on: <K extends IpcEventsKeys>(event: K, handler: Handler<K>) => void
  send: <K extends IpcEventsKeys>(event: K, ...args: Parameters<IpcEvents[K]>) => void
}

export const ipcManager: IpcManager = {
  handlers: {},
  on: <K extends IpcEventsKeys>(event: K, handler: Handler<K>) => {
    if (!ipcManager.handlers[event]) {
      Object.assign(ipcManager.handlers, { [event]: [] })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ipcMain.on(event, (e: IpcMainEvent, ...args: any[]) => {
        ipcManager.handlers[event]?.forEach(h => h(e, ...args))
      })
    }
    ipcManager.handlers[event]?.push(handler)
  },
  send: <K extends IpcEventsKeys>(event: K, ...args: Parameters<IpcEvents[K]>) => {

    // convert object to json string
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    args = args.map(arg => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg)
      }
      return arg
    })

    webContents.getAllWebContents().forEach((webContent) => {
      webContent.send(event, ...args)
    })
  }
}
