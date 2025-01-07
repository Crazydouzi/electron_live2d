import { IgnoreMouseEventsOptions } from "electron"

export interface IpcEvents {
  'set-ignore-mouse-events': (arg: boolean, options?: IgnoreMouseEventsOptions) => void
  'set-always-on-Top': (arg: boolean) => void
  'set-live2d-visible': (arg: boolean) => void
}
