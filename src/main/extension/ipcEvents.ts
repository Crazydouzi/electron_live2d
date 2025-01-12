import { BrowserWindow, IgnoreMouseEventsOptions, IpcMain } from "electron";
import { ipcManager } from "./ipcManager";
import l2dManager from "./l2dManager";
export default {
  loadEvents
}
function loadEvents(ipcMain: IpcMain) {

  ipcManager.handle("get-model-list", () => l2dManager.getModelPath() + "/Hiyori/Hiyori.model3.json")
  ipcMain.on('set-ignore-mouse-events', (event, arg: boolean, options?: IgnoreMouseEventsOptions) => {
    BrowserWindow.fromWebContents(event.sender)?.setIgnoreMouseEvents(arg, options)
  })
}

