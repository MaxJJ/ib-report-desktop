import { FC, useState } from "react";
import { IbReportParsingResult } from "../../../shared/types";
import { Section, SectionCard } from "@blueprintjs/core";

interface IbParsingSummaryProps{data:IbReportParsingResult}

export const IbParsingSummary:FC<IbParsingSummaryProps> = (props:IbParsingSummaryProps) => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
   
    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      
      if (files) {
        setSelectedFile(files[0]); // Handle only the first selected file
         window.bridge.sendStartFileParsing(files.item(0).path)
      }
    };
  
  
    return (
      <div style={{ display: 'flex', maxWidth:'100%',height:'100%'}}>



        <Section title="Account">
    <SectionCard >
    <div>{props.data && props.data.account} </div>
        <div>{props.data && props.data.name} </div>
        <div>{props.data && props.data.baseCurrency} </div>
    </SectionCard>
 
</Section>

        <Section title="Option Trades">
    <SectionCard >
    <div className="grid-2-cols">
        <div>First trade at</div>
        <div>{props.data && new Date(props.data.optionsTradesFrom).toLocaleDateString()} </div>
        <div>Last trade at</div>
        <div>{props.data && new Date(props.data.optionsTradesTo).toLocaleDateString()} </div>
        <div>Number of trades</div>
        <div>{props.data && props.data.optionsTrades.dateTimeColumn.length} </div>
    </div>
        
    </SectionCard>
 
</Section>

      </div>
    );
  };