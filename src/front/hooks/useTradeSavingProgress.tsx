import { useEffect, useState } from "react";
import { IbReportParsingResult, ParsingResultListener, TradesRecords, TradesSavingProgress, TradesSavingProgressListener } from "../../shared/types";

export const useTradeSavingProgress = () => {
    const [ savingProgress, setSavingProgress ] = useState<TradesSavingProgress>();

    const listener:TradesSavingProgressListener = (data) => {
        setSavingProgress(data);
      
    }

    useEffect( () => {
        
        window.bridge.listenTradesSavingProgress(listener)

    }, [] );

    return savingProgress;
}