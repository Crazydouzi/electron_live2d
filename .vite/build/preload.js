"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {};
try {
  electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
  electron.contextBridge.exposeInMainWorld("electronAPI", {
    setIgnoreMouseEvent: (arg, options = { forward: true }) => electron.ipcRenderer.send("set-ignore-mouse-events", arg, options),
    setAlwaysOnTop: (arg) => electron.ipcRenderer.send("set-always-on-Top", arg)
  });
  electron.contextBridge.exposeInMainWorld("api", api);
} catch (error) {
  console.error(error);
}
