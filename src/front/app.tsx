import { AnchorButton, Button, FileInput } from "@blueprintjs/core";
import { FC } from "react"
import * as React from 'react';
import { InputFileParse } from "./components/input-file-parse";
import { OptionTradesTable } from "./components/tables/option-trades-table";


export const AppWrap:FC<any> = () => {
 
    return (
        
    <div style={{display:'flex',flexDirection:'column'}}>
    <InputFileParse/>
    <OptionTradesTable/>
    

    </div>


    )
}