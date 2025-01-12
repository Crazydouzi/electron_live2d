/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { IpcEvents, IpcEventsKeys } from '../types'
import type { Handler } from './extension/ipcManager'


const parameterFormatter = <T>(args: any[]) => {
  if (!args) return [] as T;
  return args.map(arg => {
    if (typeof arg === 'function') {
      return arg.toString();
    }
    if (typeof arg === 'object' && arg !== null) {
      return JSON.stringify(arg);
    }
    if (typeof arg === 'string') {
      try {
        return JSON.parse(arg);
      } catch {
        return arg;
      }
    }
    return arg;
  }) as T;
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
try {
  const ipcManager = {
    // 发送到主进程
    send: <K extends IpcEventsKeys>(channel: K, ...args: Parameters<IpcEvents[K]>) => ipcRenderer.send(channel, ...args),
    // 接受来自主进程
    on: <K extends IpcEventsKeys>(channel: K, listener: Handler<K>) => {
      const listenerWrapper = (_event: IpcRendererEvent, ...args: Parameters<Handler<K>>) =>
        listener(...parameterFormatter<Parameters<Handler<K>>>(args));
      ipcRenderer.on(channel, listenerWrapper);
      return () => ipcRenderer.removeListener(channel, listenerWrapper);
    },
    handle: <K extends IpcEventsKeys>(channel: K) => ipcRenderer.invoke(channel)
  }

  contextBridge.exposeInMainWorld('ipcManager', ipcManager);
} catch (error) {
  console.error(error)
}
