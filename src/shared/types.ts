import { Trade } from "../main/storage/models/trades";

export interface IBridge{

    send:(channel:string, ...args: any[])=>void;
    invoke:(channel:string, ...args: any[])=>Promise<any>;

    sendStartFileParsing:(args:SendParseFileArgs)=>void;
    listenFileParsingResult:(listener:ParsingResultListener)=>void;

    sendStartOptionTradesSave:(args:StartTradesSavingArgs)=>void;
    listenTradesSavingProgress:(listener:TradesSavingProgressListener)=>void;

    getTradesFifo:(filter: TradesFilter ) => Promise<DbTrade[][]>;

    runXmlBuild:(data:DbTrade[],path:string, props:EdsReportProps)=>void;


}

export enum AppChannels{
    sendStartFileParsing="sendStartFileParsing",
    parsingResult="parsingResult",
    saveOptionTrades = "saveOptionTrades",
    tradeSavingProgress = "tradeSavingProgress",
    getTradesFifo = "getTradesFifo",
    runXmlBuild = "runXmlBuild"
}

export type TradesRecords = {

    title:string
    subtitle:string
    originalHeaders:string[]
    assetCategoryColumn:string[]
    symbolColumn:string[]
    currencyColumn:string[]
    dateTimeColumn:number[]
    quantityColumn:number[]
    transactionPriceColumn:number[]
    closingPriceColumn:number[]
    proceedsColumn:number[]
    commissionColumn:number[]
    basisColumn:number[]
    realizedPLColumn:number[]
    mtmPLColumn:number[]
    codeColumn:string[]


}

export type OptionCashSettlementRecords = {
    title:string
    subtitle:string
    originalHeaders:string[]
    currencyColumn:string[]
    dateTimeColumn:number[]
    descriptionColumn:string[]
    symbolColumn:string[]
    amountColumn:number[]


}

export type IbReportParsingResult = {
    account:string
    name:string
    baseCurrency:string
    stocksTrades:TradesRecords
    stockTradesFrom:number
    stocksTradesTo:number
    stocksTradesSymbols:string[]
    optionsTrades:TradesRecords
    optionsTradesFrom:number
    optionsTradesTo:number
    optionsTradesSymbols:string[]
    optionsCashSettlement:OptionCashSettlementRecords
}

export type ParseFileRequestArgs = string;

export type ParseFileResponse = TradesRecords;

export type SendParseFileArgs = string;

export type ParsingResultListener = (data:IbReportParsingResult) => void


export enum AssetCategories{
    STOCK="stock",
    OPTION="option"
}

export enum TradeCodes{
    O="Opening Trade",
    C="Closing Trade",
    P="Partial Execution",
    Ep="Resulted from an Expired Position",
    Ex="Exercise",
    A="Assignment",

}

export enum MainProcessStatus{
    SUCCESS="success",
    FAILURE="failure",
    IN_PROGRESS="in_progress",
    COMPLETED = "completed",
    STARTED = "starting",
    PENDING = "pending",
    FINISHED = "finished"


}

export type StartTradesSavingArgs = IbReportParsingResult
export type TradesSavingProgress={
    status:string,
    trade:Trade,
    message:string

}

export type TradesSavingProgressListener = (data:TradesSavingProgress) => void

export type TradesFilter = {
    account:string
    symbol?:string
    dateFrom?:number
    dateTo?:number
}

export type DbTrade = object & Trade

export type EdsReportProps = {
    year:number
    quarter:number,
    month:number
    name:string
    code:number
    email:string
    phone:string
}
