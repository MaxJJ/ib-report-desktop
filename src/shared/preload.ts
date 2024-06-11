// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcMain, ipcRenderer } from "electron";
import { AppChannels, IBridge, ParseFileRequestArgs } from "./types";

export {};

const Bridge:IBridge = {
    send: function (channel: string, ...args: any[]): void {
        throw new Error("Function not implemented.");
    },
    invoke: function (channel: string, ...args: any[]): Promise<any> {
        throw new Error("Function not implemented.");
    },
    parseFile: function (args: ParseFileRequestArgs): Promise<[]> {
        const channel = AppChannels.parseFile;
        return ipcRenderer.invoke(channel,args);
    }
}



declare global {
    interface Window{
        bridge:IBridge; 
    }
    
}

contextBridge.exposeInMainWorld("bridge",Bridge);
