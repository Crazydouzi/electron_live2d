/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { contextBridge, IgnoreMouseEventsOptions, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
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
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('electronAPI', {
    setIgnoreMouseEvent: (arg:boolean,options: IgnoreMouseEventsOptions={forward:true}) => ipcRenderer.send('set-ignore-mouse-events', arg,options),
    setAlwaysOnTop:(arg:boolean) => ipcRenderer.send('set-always-on-Top', arg)
  })

  const ipcManager = {
    // 发送到主进程
    send: <K extends IpcEventsKeys>(channel: K, ...args: Parameters<IpcEvents[K]>) => ipcRenderer.send(channel, ...args),
    // 接受来自主进程
    on: <K extends IpcEventsKeys>(channel: K, listener: Handler<K>) => {
      const listenerWrapper = (_event: IpcRendererEvent, ...args: Parameters<Handler<K>>) =>
        listener(...parameterFormatter<Parameters<Handler<K>>>(args));
      ipcRenderer.on(channel, listenerWrapper);
      return () => ipcRenderer.removeListener(channel, listenerWrapper);
    }
  }

  contextBridge.exposeInMainWorld('ipcManager', ipcManager);
} catch (error) {
  console.error(error)
}

// --------- Expose some API to the Renderer process ---------
// contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))

// window['ipcRenderer'] = require('electron').ipcRenderer
// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.


// --------- Preload scripts loading ---------
// function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
//   return new Promise((resolve) => {
//     if (condition.includes(document.readyState)) {
//       resolve(true)
//     } else {
//       document.addEventListener('readystatechange', () => {
//         if (condition.includes(document.readyState)) {
//           resolve(true)
//         }
//       })
//     }
//   })
// }

// const safeDOM = {
//   append(parent: HTMLElement, child: HTMLElement) {
//     if (!Array.from(parent.children).find((e) => e === child)) {
//       parent.appendChild(child)
//     }
//   },
//   remove(parent: HTMLElement, child: HTMLElement) {
//     if (Array.from(parent.children).find((e) => e === child)) {
//       parent.removeChild(child)
//     }
//   }
// }

// /**
//  * https://tobiasahlin.com/spinkit
//  * https://connoratherton.com/loaders
//  * https://projects.lukehaas.me/css-loaders
//  * https://matejkustec.github.io/SpinThatShit
//  */
// function useLoading() {
//   const className = `loaders-css__square-spin`
//   const styleContent = `
// @keyframes square-spin {
//   25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
//   50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
//   75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
//   100% { transform: perspective(100px) rotateX(0) rotateY(0); }
// }
// .${className} > div {
//   animation-fill-mode: both;
//   width: 50px;
//   height: 50px;
//   background: #fff;
//   animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
// }
// .app-loading-wrap {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: #282c34;
//   z-index: 9;
// }
//     `
//   const oStyle = document.createElement('style')
//   const oDiv = document.createElement('div')

//   oStyle.id = 'app-loading-style'
//   oStyle.innerHTML = styleContent
//   oDiv.className = 'app-loading-wrap'
//   oDiv.innerHTML = `<div class="${className}"><div></div></div>`

//   return {
//     appendLoading() {
//       safeDOM.append(document.head, oStyle)
//       safeDOM.append(document.body, oDiv)
//     },
//     removeLoading() {
//       safeDOM.remove(document.head, oStyle)
//       safeDOM.remove(document.body, oDiv)
//     }
//   }
// }

// // ----------------------------------------------------------------------

// const { appendLoading, removeLoading } = useLoading()
// domReady().then(appendLoading)

// window.onmessage = (ev: { data: { payload: string } }) => {
//   ev.data.payload === 'removeLoading' && removeLoading()
// }

// setTimeout(removeLoading, 4999)
