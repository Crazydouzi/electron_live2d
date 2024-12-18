"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const parameterFormatter = (args) => {
  if (!args) return [];
  return args.map((arg) => {
    if (typeof arg === "function") {
      return arg.toString();
    }
    if (typeof arg === "object" && arg !== null) {
      return JSON.stringify(arg);
    }
    if (typeof arg === "string") {
      try {
        return JSON.parse(arg);
      } catch {
        return arg;
      }
    }
    return arg;
  });
};
try {
  electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
  electron.contextBridge.exposeInMainWorld("electronAPI", {
    setIgnoreMouseEvent: (arg, options = { forward: true }) => electron.ipcRenderer.send("set-ignore-mouse-events", arg, options),
    setAlwaysOnTop: (arg) => electron.ipcRenderer.send("set-always-on-Top", arg)
  });
  const ipcManager = {
    send: (channel, ...args) => electron.ipcRenderer.send(channel, ...args),
    on: (channel, listener) => {
      const listenerWrapper = (_event, ...args) => listener(...parameterFormatter(args));
      electron.ipcRenderer.on(channel, listenerWrapper);
      return () => electron.ipcRenderer.removeListener(channel, listenerWrapper);
    }
  };
  electron.contextBridge.exposeInMainWorld("ipcManager", ipcManager);
} catch (error) {
  console.error(error);
}
