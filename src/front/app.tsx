import { AnchorButton, Button, FileInput } from "@blueprintjs/core";
import { FC } from "react"
import * as React from 'react';
import { InputFileParse } from "./components/input-file-parse";
import { OptionTradesTable } from "./components/tables/option-trades-table";
import { IbReportParsing } from "./components/Ib-report-parsing";

// style={{display:'flex',flexDirection:'column'}}
export const AppWrap:FC<any> = () => {
 
    return (
        
    <div className="layout">
    <div id="menu-container">menu</div>
      
    <IbReportParsing/>    
   
    <div id="bottom-container"></div>
    </div>


    )
}