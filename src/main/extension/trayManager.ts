import { Tray, IpcRenderer, Menu } from 'electron'
import path from 'path'
export class trayManager{
  tray: Tray | undefined
  // ipcAPI = window.electronAPI
  constructor(){
    const icon = path.join(__dirname, '/assets/icon2.png')
    const contextMenu = Menu.buildFromTemplate([
      { label: '展示L2D', type: 'checkbox', checked: true },
      { label: '始终置顶', type: 'checkbox', checked: true },
      { label: '设置'},
      { label: '退出'}
    ])
    this.tray=new Tray(icon);
    this.tray.setContextMenu(contextMenu)
  }

}
