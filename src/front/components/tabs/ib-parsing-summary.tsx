import { FC, useEffect, useState } from "react";
import { IbReportParsingResult } from "../../../shared/types";
import { Button, Section, SectionCard, Text } from "@blueprintjs/core";
import { useTradeSavingProgress } from "../../hooks/useTradeSavingProgress";

interface IbParsingSummaryProps{data:IbReportParsingResult}

export const IbParsingSummary:FC<IbParsingSummaryProps> = (props:IbParsingSummaryProps) => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const saveProgress = useTradeSavingProgress()

    useEffect(() => {
      if (saveProgress) {
        console.log(saveProgress)
    }},[saveProgress])
   
    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      
      if (files) {
        setSelectedFile(files[0]); // Handle only the first selected file
         window.bridge.sendStartFileParsing(files.item(0).path)
      }
    };

    const onOptionTradesSave = () => {
      window.bridge.sendStartOptionTradesSave(props.data);
    }
  
  
    return (
      <div className="grid-2-cols">



        <Section title="Account">
    <SectionCard >
      {props.data && 
        <>
        <div>{props.data && props.data.account} </div>
        <div>{props.data && props.data.name} </div>
        <div>{props.data && props.data.baseCurrency} </div>
        </>
      }
      {!props.data && 
      <Text>Please select csv file to parse</Text>
      }
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
        <Button disabled={!props.data} text="Save Trades to Database" onClick={onOptionTradesSave}></Button>
    </div>
        
    </SectionCard>
 
</Section>

      </div>
    );
  };