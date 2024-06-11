import { BrowserWindow } from "electron";

export class AppConfig{

    get focusedWindow() {
        return BrowserWindow.getFocusedWindow();
      
      }
}