import { app, shell, BrowserWindow, ipcMain, IgnoreMouseEventsOptions, globalShortcut } from 'electron'
import path from 'path'
import { electronApp, optimizer, } from '@electron-toolkit/utils'
import { trayManager } from './extension/trayManager';

if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 670,
    show: false,
    //无边窗口
    frame: false,
    transparent: true,
    //任务栏隐藏
    skipTaskbar: true,
    autoHideMenuBar: true,
    //全屏
    fullscreenable: true,
    fullscreen: true,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      preload: path.join(__dirname, 'preload.js'),

      defaultFontFamily:{
        standard:"Microsoft YaHei"
      },
      defaultFontSize:80,
      //开发者工具
      devTools: true,
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }
  // Open the DevTools.
  mainWindow.webContents.openDevTools();


  new trayManager().createMenu(mainWindow)

  //快捷键
  globalShortcut.register("CommandOrControl+shift+D",()=>{
    mainWindow.setIgnoreMouseEvents(true,{forward:true})
  })
  globalShortcut.register("CommandOrControl+shift+S",()=>{
    mainWindow.setIgnoreMouseEvents(false)
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // // Default open or close DevTools by F12 in development
  // // and ignore CommandOrControl + R in production.
  // // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })


  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//鼠标透传事件
ipcMain.on('set-ignore-mouse-events', (event, arg: boolean, options?: IgnoreMouseEventsOptions) => {
  // console.log(event)
  BrowserWindow.fromWebContents(event.sender)?.setIgnoreMouseEvents(arg, options)
})
ipcMain.on('set-always-on-Top',(event,arg:boolean)=>{
  BrowserWindow.fromWebContents(event.sender)?.setAlwaysOnTop(arg)
})
ipcMain.on('win-close', () => {
  globalShortcut.unregisterAll()
  app.quit()
})
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
