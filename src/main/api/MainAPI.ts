import { BrowserWindow, IpcMainInvokeEvent, ipcMain, webContents} from "electron";


import { AppChannels, DbTrade, EdsReportProps, ParseFileRequestArgs, ParseFileResponse, StartTradesSavingArgs, TradesFilter } from "../../shared/types";
import { AppConfig } from "../app-config";
import { IbReportParser } from "../services/parsers/ib-report-parser";
import { TradesQueries } from "../storage/queries/trades-queries";
import { GetTradesFifo } from "../storage/queries/get-trades-fifo";
import { EdsReportBuilder } from "../services/eds-report-builder/eds-report-builder";

import {writeFileSync} from 'fs';



export class MainAPI extends AppConfig{

    private ibParser = new IbReportParser()

    constructor(){
        super();
        this.init();
    }

    private init(){
        
   
    ipcMain.on(AppChannels.sendStartFileParsing,this.handleParseFile)
    ipcMain.on(AppChannels.saveOptionTrades,this.handleSaveOptionTrades)

    ipcMain.handle(AppChannels.getTradesFifo,async (event,args:TradesFilter)=>{
        return await GetTradesFifo(args)
    })
    
    ipcMain.on(AppChannels.runXmlBuild,(event,data:DbTrade[],path:string,props:EdsReportProps)=>{
        const xml = new EdsReportBuilder(data,props).getXml()
        writeFileSync(path,xml,{encoding:'utf8',flag:'w'})
    })
  

    }

    // result.replace(/\s/g, "")

    private handleParseFile = async (event:IpcMainInvokeEvent,args:ParseFileRequestArgs) => {
        
        await this.ibParser.parseIbCsv(args);
        const tradesRecords = this.ibParser.optionsTrades;
        BrowserWindow.getFocusedWindow().webContents.send(AppChannels.parsingResult,this.ibParser.parsingResult)
        
       
    }
    private handleSaveOptionTrades = async (event:IpcMainInvokeEvent,args:StartTradesSavingArgs) => {
        
        const q = new TradesQueries(args)
        await q.saveOptionTrades()
       
    }
}