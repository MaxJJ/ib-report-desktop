import { BrowserWindow, IpcMainInvokeEvent, ipcMain, webContents} from "electron";

import { createReadStream } from 'fs';
import { createInterface } from 'readline';

import { AppChannels, ParseFileRequestArgs, ParseFileResponse } from "../../shared/types";
import { AppConfig } from "../app-config";
import { IbReportParser } from "../services/parsers/ib-report-parser";


export class MainAPI extends AppConfig{

    private ibParser = new IbReportParser()

    constructor(){
        super();
        this.init();
    }

    private init(){
        
   
    ipcMain.on(AppChannels.sendStartFileParsing,this.handleParseFile)
    
  

    }

    // result.replace(/\s/g, "")

    private handleParseFile = async (event:IpcMainInvokeEvent,args:ParseFileRequestArgs) => {
        
        await this.ibParser.parseIbCsv(args);
        const tradesRecords = this.ibParser.optionsTrades;
        BrowserWindow.getFocusedWindow().webContents.send(AppChannels.parsingResult,this.ibParser.parsingResult)
        
       
    }
}