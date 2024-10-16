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

export type TradesRecords = {

    title:string
    originalHeaders:string[]
    assetCategoryColumn:string[]
    currencyColumn:string[]
    dateTimeColumn:string[]
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

export class IbReportResolver{

    private STATEMENT_TITLE = "Statement"

    private ACCOUNT_INFO_TITLE = "Account Information"
    private ACCOUNT_FIELD = "Account"
    private BASE_CURRENCY_FIELD = "Base Currency"

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

    constructor(data:CsvSection[]){

        this.Data = data
    }

    private getSectionsDataColumn(section:CsvSection,header:string,filterData = true){

        const sectionCopy = {...section}
        if(filterData){
           sectionCopy.data = section.data.filter(row=>{
            const headerIndex = section.header.indexOf('Header')
            return  row[headerIndex] == 'Data'
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

        const rows = data.data

        const accountRow = rows.filter(r=>r[0] == this.ACCOUNT_FIELD)[0]

        return accountRow[1]
    }

    get baseCurrency(){
        const data = this.Data.filter(item => item.title == this.ACCOUNT_INFO_TITLE)[0]

        const rows = data.data

        const baseCurrencyRow = rows.filter(r=>r[0] == this.BASE_CURRENCY_FIELD)[0]

        return baseCurrencyRow[1]
    }

    private getSectionColumnIndex(section:CsvSection,columnName:string):number{

        return section.header.indexOf(columnName)
    }

    private getOptionsTradesSection(){

        const tradesSections = this.Data.filter(section => section.title == this.TRADES)
        const assetCategory = "Equity and Index Options"

        const opionsTradesSectionFiltered = tradesSections.filter(section => {
            const columnIndex = this.getSectionColumnIndex(section,TradesColumnsNames.AssetCategory)
            if(columnIndex >= 0){
                return section.data[1][columnIndex] == assetCategory
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
        result.originalHeaders = this.TradesSection.header
        result.assetCategoryColumn = this.getSectionsDataColumn(section,TradesColumnsNames.AssetCategory)
        result.basisColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Basis).map(v=>parseFloat(v))
        result.closingPriceColumn = this.getSectionsDataColumn(section,TradesColumnsNames.CurrentOrClosingPrice).map(v=>parseFloat(v))
        result.codeColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Code)
        result.commissionColumn = this.getSectionsDataColumn(section,TradesColumnsNames.CommisionOrFee).map(v=>parseFloat(v))
        result.currencyColumn = this.getSectionsDataColumn(section,TradesColumnsNames.Currency)
        result.dateTimeColumn = this.getSectionsDataColumn(section,TradesColumnsNames.DateTime).map(v=>v)
        return result
    }

    


}

export class IbReportParser extends FileParserBase{

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
                    console.log("includes ##",section)
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


        const ranges = this.splitByHeaders(linesArr,headersIndexes);

        const toObjs = this.toObjects(ranges);

        const resolver = new IbReportResolver(toObjs);

        console.log("Account:",resolver.optionsTradesRecords);
    }

    private splitByHeaders(lines:string[][],indexes:number[]): string[][][]{
        const result:string[][][] = []
        indexes.forEach((index,key,array)=>{
            if(array.length-2 <= index){
            result.push(lines.slice(index,array[key+1]))
            }
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
            // const startIndex = header.findIndex(h=>h=="Header");
            // const columnNames = header.slice(startIndex+1);
            rangeObj.header=header;
            
            range.forEach((line,index)=>{
               
                if(index>0){
                    // rangeObj.data.push(line.slice(startIndex+1))
                    rangeObj.data.push(line)
                }
            })

            return rangeObj;


        })
        

    }
}