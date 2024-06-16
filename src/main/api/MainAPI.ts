import { BrowserWindow, IpcMainInvokeEvent, ipcMain, webContents} from "electron";


import { AppChannels, ParseFileRequestArgs, ParseFileResponse, StartTradesSavingArgs } from "../../shared/types";
import { AppConfig } from "../app-config";
import { IbReportParser } from "../services/parsers/ib-report-parser";
import { TradesQueries } from "../storage/queries/trades-queries";



export class MainAPI extends AppConfig{

    private ibParser = new IbReportParser()

    constructor(){
        super();
        this.init();
    }

    private init(){
        
   
    ipcMain.on(AppChannels.sendStartFileParsing,this.handleParseFile)
    ipcMain.on(AppChannels.saveOptionTrades,this.handleSaveOptionTrades)
    
  

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