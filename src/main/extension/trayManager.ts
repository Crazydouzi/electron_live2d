import { Tray, Menu, BrowserWindow } from 'electron'
import path from 'path'
export class trayManager {
  tray: Tray | undefined
  // ipcAPI = window.electronAPI
  createMenu(mainWindow: BrowserWindow) {
    const icon = path.join(__dirname, '/assets/icon2.png')

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '展示L2D', type: 'checkbox', checked: true, click: async (e) => {
          mainWindow.webContents.send("set-live2d-visible", e.checked)
        }
      },
      {
        label: '始终置顶', type: 'checkbox', checked: false, click: async (e) => {
          mainWindow.setAlwaysOnTop(e.checked)
        }
      },
      { label: '设置' },
      {
        label: '退出', type: "normal", click: async () => {
          mainWindow.close()
        }
      }
    ])
    this.tray = new Tray(icon);
    this.tray.setContextMenu(contextMenu)
  }

}
