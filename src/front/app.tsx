import { AnchorButton, Button, FileInput } from "@blueprintjs/core";
import { FC } from "react"
import * as React from 'react';
import { InputFileParse } from "./components/input-file-parse";


export const AppWrap:FC<any> = () => {
 
    return (
        
    <div style={{display:'flex',flexDirection:'column'}}>
    <InputFileParse/>
    
    <AnchorButton text="Clicak" />
    <Button icon="refresh" />

    <FileInput disabled={false} dir="sd" text="Choose file..." />
    </div>


    )
}