"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
if (require("electron-squirrel-startup")) {
  electron.app.quit();
}
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 500,
    height: 670,
    show: false,
    //无边窗口
    frame: false,
    transparent: true,
    //任务栏隐藏
    skipTaskbar: false,
    autoHideMenuBar: true,
    //全屏
    fullscreenable: true,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      defaultFontFamily: {
        standard: "Microsoft YaHei"
      },
      defaultFontSize: 80,
      //开发者工具
      devTools: true,
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  {
    mainWindow.loadURL("http://localhost:5173");
  }
  mainWindow.webContents.openDevTools();
  electron.globalShortcut.register("CommandOrControl+shift+S", () => {
    mainWindow.setIgnoreMouseEvents(false);
  });
}
let tray;
const contextMenu = electron.Menu.buildFromTemplate([
  { label: "展示L2D", type: "checkbox", checked: true },
  { label: "始终置顶", type: "checkbox", checked: true },
  { label: "设置" },
  { label: "退出" }
]);
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  const icon = path.join(__dirname, "/assets/icon2.png");
  tray = new electron.Tray(icon);
  tray.setContextMenu(contextMenu);
  createWindow();
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.ipcMain.on("set-ignore-mouse-events", (event, arg, options) => {
  var _a;
  (_a = electron.BrowserWindow.fromWebContents(event.sender)) == null ? void 0 : _a.setIgnoreMouseEvents(arg, options);
});
electron.ipcMain.on("set-always-on-Top", (event, arg) => {
  var _a;
  (_a = electron.BrowserWindow.fromWebContents(event.sender)) == null ? void 0 : _a.setAlwaysOnTop(arg);
});
electron.ipcMain.on("win-close", () => {
  electron.globalShortcut.unregisterAll();
  electron.app.quit();
});
