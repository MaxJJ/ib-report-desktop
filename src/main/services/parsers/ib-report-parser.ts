import { IbReportParsingResult, TradesRecords } from "../../../shared/types";
import { FileParserBase } from "./parser-base";

export type CsvSection = {
    title:string;
    header:string[]
    data:string[][]
}

export enum TradesColumnsNames {

    DataDiscriminator= "DataDiscriminator",
    AssetCategory = "Asset Category",
    Currency = "Currency",
    Symbol = "Symbol",
    DateTime = "Date/Time",
    Quantity = "Quantity",
    TransactionPrice = "T. Price",
    CurrentOrClosingPrice = "C. Price",
    Proceeds = "Proceeds",
    CommisionOrFee = "Comm/Fee",
    Basis = "Basis",
    RealizedPL = "Realized P/L",
    MarkToMarketPL = "MTM P/L",
    Code = "Code"

}



export class IbReportResolver{

    private STATEMENT_TITLE = "Statement"

    private ACCOUNT_INFO_TITLE = "Account Information"
    private ACCOUNT_FIELD = "Account"
    private BASE_CURRENCY_FIELD = "Base Currency"
    private NAME_FIELD = "Name"

    private NET_ASSET_VALUE_TITLE = "Net Asset Value"
    private CHANGE_IN_NAV = "Change in NAV"
    private MARK_TO_MARKET_PERFORMANCE_TITLE = "Mark-to-Market Performance Summary"
    private REALIZED_UNREALIZED_PERFORMANCE_TITLE = "Realized & Unrealized Performance Summary"
    private MONTH_AND_YEAR_TO_DATE_PERFORMANCE_TITLE = "Month & Year to Date Performance Summary"
    private CASH_REPORT_TITLE = "Cash Report"
    private TRADES = "Trades"
    private TRANSFERS = "Transfers"
    private DEPOSITS_AND_WITHDRAWALS = "Deposits & Withdrawals"
    private FINANCIAL_INSTRUMENTS_INFORMATION = "Financial Instrument Information"
    private CODES = "Codes"

    private Data:CsvSection[] = []

    stockTradesSymbols:string[] = []
    stockTradesFrom = 0
    stockTradesTo = 0
    optionsTradesSymbols:string[] = []
    optionsTradesFrom = 0
    optionsTradesTo = 0

    constructor(data:CsvSection[]){

        this.Data = data
    }

    private getSectionsDataColumn(section:CsvSection,header:string,filterData = true){

        const sectionCopy = {...section}
        if(filterData){
           sectionCopy.data = section.data.filter(row=>{
            const headerIndex = section.header.indexOf('Header')
            return  row[headerIndex].includes('Data')
           }) 
        }
        
        const columnIndex = sectionCopy.header.indexOf(header)
        const column = columnIndex >=0 ? sectionCopy.data.map(row=>row[columnIndex]) : []

        return column

    }

    get TradesSection():CsvSection{
        return this.Data.filter(item => item.title == this.TRADES)[0]
    }

    get account(){
        const data = this.Data.filter(item => item.title == this.ACCOUNT_INFO_TITLE)[0]
        console.log("account data: ",data)
        console.log("Data: ",this.Data)

        const rows = data.data

        const fieldNameIndex = this.getSectionColumnIndex(data,'Field Name')
        const fieldValueIndex = this.getSectionColumnIndex(data,'Field Value')

        const accountRow = rows.filter(r=>r[fieldNameIndex] == this.ACCOUNT_FIELD)[0]

        return accountRow[fieldValueIndex]
    }

    get baseCurrency(){
        const data = this.Data.filter(item => item.title == this.ACCOUNT_INFO_TITLE)[0]

        const rows = data.data

        const fieldNameIndex = this.getSectionColumnIndex(data,'Field Name')
        const fieldValueIndex = this.getSectionColumnIndex(data,'Field Value')

        const baseCurrencyRow = rows.filter(r=>r[fieldNameIndex] == this.BASE_CURRENCY_FIELD)[0]

        return baseCurrencyRow[fieldValueIndex]
    }

    get name(){
        const data = this.Data.filter(item => item.title == this.ACCOUNT_INFO_TITLE)[0]

        const rows = data.data
        const fieldNameIndex = this.getSectionColumnIndex(data,'Field Name')
        const fieldValueIndex = this.getSectionColumnIndex(data,'Field Value')
        

        const nameRow = rows.filter(r=>r[fieldNameIndex] == this.NAME_FIELD)[0]

        return nameRow[fieldValueIndex]
    }

    private getSectionColumnIndex(section:CsvSection,columnName:string):number{
        let ix = -1;
        section.header.forEach((h,i,a)=>{
            if(h.includes(columnName)){
                ix=i
            }
        })
        // return section.header.indexOf(columnName)
        return ix
    }

    private getOptionsTradesSection(){

        const tradesSections = this.Data.filter(section => section.title == this.TRADES)
        const assetCategory = "Equity and Index Options"

        const opionsTradesSectionFiltered = tradesSections.filter(section => {
            const columnIndex = this.getSectionColumnIndex(section,TradesColumnsNames.AssetCategory)
            if(columnIndex >= 0){
                return section.data[1][columnIndex].includes(assetCategory)
            }else{
                return false
            }
            
        })

        return opionsTradesSectionFiltered.length ? opionsTradesSectionFiltered[0] : {} as CsvSection
    }

    get optionsTradesRecords():TradesRecords{
        
        const section:CsvSection = this.getOptionsTradesSection()
        const result:TradesRecords = {} as TradesRecords

        result.title = "Trades"
        result.subtitle = "Options"
        result.originalHeaders = this.TradesSection.header
        result.assetCategoryColumn = this.getSectionsDataColumn(section,TradesColumnsNames.AssetCategory)
        result.basisColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Basis).map(v=>parseFloat(v))
        result.closingPriceColumn = this.getSectionsDataColumn(section,TradesColumnsNames.CurrentOrClosingPrice).map(v=>parseFloat(v))
        result.transactionPriceColumn = this.getSectionsDataColumn(section,TradesColumnsNames.TransactionPrice).map(v=>parseFloat(v))
        result.codeColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Code)
        result.commissionColumn = this.getSectionsDataColumn(section,TradesColumnsNames.CommisionOrFee).map(v=>parseFloat(v))
        result.currencyColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Currency)
        result.dateTimeColumn = this.getSectionsDataColumn(section,TradesColumnsNames.DateTime).map(v=>new Date(v).getTime())
        result.quantityColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Quantity).map(v=>parseFloat(v))
        result.mtmPLColumn = this.getSectionsDataColumn(section,TradesColumnsNames.MarkToMarketPL).map(v=>parseFloat(v))
        result.proceedsColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Proceeds).map(v=>parseFloat(v))
        result.realizedPLColumn = this.getSectionsDataColumn(section,TradesColumnsNames.RealizedPL).map(v=>parseFloat(v))
        result.symbolColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Symbol)

        const tradesFrom = Math.min(...result.dateTimeColumn)
        const tradesTo = Math.max(...result.dateTimeColumn)
        const symbols = Array.from(new Set(result.symbolColumn))

        this.optionsTradesFrom = tradesFrom
        this.optionsTradesTo = tradesTo
        this.optionsTradesSymbols = symbols
        return result
    }
    private getStocksTradesSection(){

        const tradesSections = this.Data.filter(section => section.title == this.TRADES)
        const assetCategory = "Stocks"

        const opionsTradesSectionFiltered = tradesSections.filter(section => {
            const columnIndex = this.getSectionColumnIndex(section,TradesColumnsNames.AssetCategory)
            if(columnIndex >= 0){
                return section.data[1][columnIndex].includes(assetCategory)
            }else{
                return false
            }
            
        })

        return opionsTradesSectionFiltered.length ? opionsTradesSectionFiltered[0] : null
    }

    get stocksTradesRecords():TradesRecords{
        
        const section:CsvSection = this.getStocksTradesSection()
        if(section){
        const result:TradesRecords = {} as TradesRecords

        result.title = "Trades"
        result.subtitle = "Stocks"
       
        result.originalHeaders = this.TradesSection.header
        result.assetCategoryColumn = this.getSectionsDataColumn(section,TradesColumnsNames.AssetCategory)
        result.basisColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Basis).map(v=>parseFloat(v))
        result.closingPriceColumn = this.getSectionsDataColumn(section,TradesColumnsNames.CurrentOrClosingPrice).map(v=>parseFloat(v))
        result.transactionPriceColumn = this.getSectionsDataColumn(section,TradesColumnsNames.TransactionPrice).map(v=>parseFloat(v))
        result.codeColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Code)
        result.commissionColumn = this.getSectionsDataColumn(section,TradesColumnsNames.CommisionOrFee).map(v=>parseFloat(v))
        result.currencyColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Currency)
        result.dateTimeColumn = this.getSectionsDataColumn(section,TradesColumnsNames.DateTime).map(v=>new Date(v).getTime())
        result.quantityColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Quantity).map(v=>parseFloat(v))
        result.mtmPLColumn = this.getSectionsDataColumn(section,TradesColumnsNames.MarkToMarketPL).map(v=>parseFloat(v))
        result.proceedsColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Proceeds).map(v=>parseFloat(v))
        result.realizedPLColumn = this.getSectionsDataColumn(section,TradesColumnsNames.RealizedPL).map(v=>parseFloat(v))
        result.symbolColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Symbol)

        const tradesFrom = Math.min(...result.dateTimeColumn)
        const tradesTo = Math.max(...result.dateTimeColumn)
        const symbols = Array.from(new Set(result.symbolColumn))

        this.stockTradesFrom = tradesFrom
        this.stockTradesTo = tradesTo
        this.stockTradesSymbols = symbols

        

        return result
        }else{
            return null
        }
    }

    


}

export class IbReportParser extends FileParserBase{

    optionsTrades:TradesRecords = {} as TradesRecords
    stocksTrades:TradesRecords = {} as TradesRecords

    parsingResult:IbReportParsingResult = {} as IbReportParsingResult

    constructor(){
        super()
    }

    public async parseIbCsv(path:string){
        const linesArr:string[][]=[];
        const applyToLine = (line:string) => {
            line=line.replace(/,"/,"##@@")
            line=line.replace(/",/,"@@##")
            const quotedSplit = line.split("##")
            const lArr:string[] = []
            quotedSplit.forEach((section) => {
                if(section.includes("@@")){
                    lArr.push(section.replace(/@@/g,""))
                }else{
                    lArr.push(...section.split(","))
                }
            })

            // const lArr = line.split(",")
            const result = lArr.map((item:string, index) => {
                const trimmed = item.trim();
                return trimmed
            })

           linesArr.push(result);
        }

        

        await this.readLineByLine(path,applyToLine)

        const headersIndexes:number[] = [];
        
        linesArr.forEach((line:string[],index:number)=>{
            if(line.includes('Header')){
                headersIndexes.push(index)
            }
        })

        console.log('Indexes! : ',headersIndexes)
        const ranges = this.splitByHeaders(linesArr,headersIndexes);

        const toObjs = this.toObjects(ranges);

        const resolver = new IbReportResolver(toObjs);

       
        this.parsingResult.account = resolver.account
        this.parsingResult.name = resolver.name
        this.parsingResult.baseCurrency = resolver.baseCurrency
        if(resolver.stocksTradesRecords){
        this.parsingResult.stocksTrades = resolver.stocksTradesRecords
        this.parsingResult.stockTradesFrom = resolver.stockTradesFrom
        this.parsingResult.stocksTradesTo = resolver.stockTradesTo
        this.parsingResult.stocksTradesSymbols = resolver.stockTradesSymbols
        }
        this.parsingResult.optionsTrades = resolver.optionsTradesRecords
        this.parsingResult.optionsTradesFrom = resolver.optionsTradesFrom
        this.parsingResult.optionsTradesTo = resolver.optionsTradesTo
        this.parsingResult.optionsTradesSymbols = resolver.optionsTradesSymbols
       

        console.log("Account:",resolver.optionsTradesRecords);
    }

    private splitByHeaders(lines:string[][],indexes:number[]): string[][][]{
        const result:string[][][] = []
        indexes.forEach((index,key,array)=>{
            // if((array.length-2) <= index){
            // result.push(lines.slice(index,array[key+1]))
            // }
            result.push(lines.slice(index,array[key+1]))
        })


        return result
    }


   

    private toObjects(ranges:string[][][]){

     return ranges.map((range)=>{

            const rangeObj:CsvSection = {
                title: "",
                header: [],
                data: []
            };
            const header = range[0];
            rangeObj.title = header[0];
            rangeObj.header=header;
            
            range.forEach((line,index)=>{
               
                if(index>0){
                    rangeObj.data.push(line)
                }
            })

            return rangeObj;


        })
        

    }
}