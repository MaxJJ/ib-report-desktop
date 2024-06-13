export interface IBridge{

    send:(channel:string, ...args: any[])=>void;
    invoke:(channel:string, ...args: any[])=>Promise<any>;

    sendStartFileParsing:(args:SendParseFileArgs)=>void;
    listenFileParsingResult:(listener:ParsingResultListener)=>void
    



}

export enum AppChannels{
    sendStartFileParsing="sendStartFileParsing",
    parsingResult="parsingResult"
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

export type ParseFileRequestArgs = string;

export type ParseFileResponse = TradesRecords;

export type SendParseFileArgs = string;

export type ParsingResultListener = (data:TradesRecords) => void