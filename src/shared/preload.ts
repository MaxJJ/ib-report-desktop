// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcMain, ipcRenderer } from "electron";
import { AppChannels, IBridge, IbReportParsingResult, ParseFileRequestArgs, ParsingResultListener, SendParseFileArgs, TradesRecords, TradesSavingProgress, TradesSavingProgressListener } from "./types";

export {};

const Bridge:IBridge = {
    send: function (channel: string, ...args: any[]): void {
        throw new Error("Function not implemented.");
    },
    invoke: function (channel: string, ...args: any[]): Promise<any> {
        throw new Error("Function not implemented.");
    },
    sendStartFileParsing: function (args: SendParseFileArgs): void {
        ipcRenderer.send(AppChannels.sendStartFileParsing, args);
    },
    listenFileParsingResult: function (listener: ParsingResultListener): void {
        ipcRenderer.on(AppChannels.parsingResult, (event, args: IbReportParsingResult) => {
            listener(args);
        });


    },
    sendStartOptionTradesSave: function (args: IbReportParsingResult): void {
        ipcRenderer.send(AppChannels.saveOptionTrades, args);
    },
    listenTradesSavingProgress: function (listener: TradesSavingProgressListener): void {
        ipcRenderer.on(AppChannels.tradeSavingProgress, (event, args: TradesSavingProgress) => {
            listener(args);
        });
    }
}



declare global {
    interface Window{
        bridge:IBridge; 
    }
    
}

contextBridge.exposeInMainWorld("bridge",Bridge);
