import { IpcMainInvokeEvent, ipcMain} from "electron";

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
        
    ipcMain.handle(AppChannels.parseFile,this.handleParseFile);

    }

    // result.replace(/\s/g, "")

    private handleParseFile = async (event:IpcMainInvokeEvent,args:ParseFileRequestArgs):Promise<ParseFileResponse> => {
        const result:ParseFileResponse = [];

        this.ibParser.parseIbCsv(args);
        return result
    }
}