import { useEffect, useState } from "react";
import { IbReportParsingResult, ParsingResultListener, TradesRecords } from "../../shared/types";

export const useParsingResult = () => {
    const [ tradesRecords, setTradesRecords ] = useState<IbReportParsingResult>();

    const listener:ParsingResultListener = (data) => {
        setTradesRecords(data);
      
    }

    useEffect( () => {
        
        window.bridge.listenFileParsingResult(listener)

    }, [] );

    return tradesRecords;
}