import { useEffect, useState } from "react";
import { ParsingResultListener, TradesRecords } from "../../shared/types";

export const useParsingResult = () => {
    const [ tradesRecords, setTradesRecords ] = useState<TradesRecords>();

    const listener:ParsingResultListener = (data) => {
        setTradesRecords(data);
        console.log(data);
    }

    useEffect( () => {
        
        window.bridge.listenFileParsingResult(listener)

    }, [] );

    return tradesRecords;
}