import { Trade, openTradeRealm } from "../storage/models/trades";
import {Realm, UpdateMode} from "realm";

let R:Realm;


let TRADES:Trade[] = []

const setTrades = async () => {
    const trs = R.objects("Trade").toJSON() as unknown as Trade[]
    trs.forEach(tr =>{
        tr.netProceeds = tr.proceeds + tr.fees
        tr.netProceedsEur = Math.round((tr.netProceeds / tr.rate) * 100) / 100
        tr.netPriceEur = Math.abs(Math.round(tr.netProceedsEur / tr.quantity * 100) / 100)
        R.write(()=>{
            R.create("Trade",tr,UpdateMode.Modified)
        })
        TRADES.push(tr)
    })
    // TRADES.push(...trs);

}

const getAccounts = ():string[] =>{
    
    return Array.from(new Set(TRADES.map(t=>t.account)));
   
}

const getSymbols = (trades:Trade[]):string[] =>{
    
    return Array.from(new Set(trades.map(t=>t.symbol)));
   
}

const getTradesByAccount = (account:string):Trade[] =>{
    return R.objects('Trade').filtered('account = $0',account).toJSON() as unknown as Trade[];
}

const getTradesBySymbolSorted = (symbol:string):Trade[] =>{
    return R.objects('Trade').filtered('symbol = $0',symbol).sorted('date').toJSON() as unknown as Trade[];
}

let OPEN_PRICE = 0
const getPreviousTrades = (trades:Trade[],index:number):Trade[] =>{
    return trades.slice(0,index);

}

export enum TradeSide{
    OPEN_BUY = "OpenBuy",
    PARTIAL_OPEN_BUY = "PartialOpenBuy",
    OPEN_SELL = "OpenSell",
    PARTIAL_OPEN_SELL = "PartialOpenSell",
    CLOSE_BUY = "CloseBuy",
    PARTIAL_CLOSE_BUY = "PartialCloseBuy",
    CLOSE_SELL = "CloseSell",
    PARTIAL_CLOSE_SELL = "PartialCloseSell",
    CLOSE_EXPIRATION = "CloseExpiration",
    CLOSE_EXERCISE = "CloseExersise"

}

const getTradeSide = (trade:Trade,unclosed:number):TradeSide => {

    const codes = trade.tradeType.split(";").map(c=>c.trim())


    if(unclosed == 0 && (!codes.includes("Ep") && !codes.includes("Ex"))){
        if(trade.quantity > 0){return TradeSide.OPEN_BUY}
        if(trade.quantity < 0){return TradeSide.OPEN_SELL}
      
    }else{
        if(codes.includes("Ep")){return TradeSide.CLOSE_EXPIRATION}
        if(codes.includes("Ex")){return TradeSide.CLOSE_EXERCISE}

        
        if(unclosed > 0 && (unclosed + trade.quantity) == 0){return TradeSide.CLOSE_SELL}
        if(unclosed < 0 && (unclosed + trade.quantity) == 0){return TradeSide.CLOSE_BUY}

        if(unclosed > 0 && trade.quantity > 0 ){return TradeSide.PARTIAL_OPEN_BUY}
        if(unclosed < 0 && trade.quantity < 0 ){return TradeSide.PARTIAL_OPEN_SELL}
        if(unclosed > 0 && trade.quantity < 0){return TradeSide.PARTIAL_CLOSE_SELL}
        if(unclosed < 0 && trade.quantity > 0){return TradeSide.PARTIAL_CLOSE_BUY}
    }
}

export const formatNumber = (value:number,abs = false):number => {

    const f = Math.round(value*100) / 100;
    return abs ? Math.abs( f ) : f;

}

const getAverageOpenPrice = (trade:Trade) => {
    const tradePrice = Math.abs(trade.netProceedsEur)/ Math.abs(trade.quantity);
    
    return formatNumber((tradePrice + OPEN_PRICE)/2,true);
}

const updateFifoProps = (trade:Trade,previousTrades:Trade[]):Trade => {
    const unclosedQty = previousTrades.map(t=>t.quantity).reduce((sum,q)=>sum+q,0);
    // OPEN_PRICE = unclosedQty == 0 ? trade.netProceedsEur / trade.quantity : OPEN_PRICE;
    const side = getTradeSide(trade,unclosedQty)

 

    switch (side) {
        case TradeSide.OPEN_BUY:
        case TradeSide.OPEN_SELL:
            OPEN_PRICE = formatNumber(trade.netProceedsEur / trade.quantity, true)
            trade.realizedPLEur = 0;
            break;
        case TradeSide.PARTIAL_OPEN_BUY:
        case TradeSide.PARTIAL_OPEN_SELL:
            OPEN_PRICE = getAverageOpenPrice(trade)
            trade.realizedPLEur = 0;
            break;
        case TradeSide.PARTIAL_CLOSE_BUY:
        case TradeSide.CLOSE_BUY:

            trade.realizedPLEur = formatNumber(trade.netProceedsEur + trade.quantity*OPEN_PRICE)
            
            break;
        case TradeSide.PARTIAL_CLOSE_SELL:
        case TradeSide.CLOSE_SELL:
            trade.realizedPLEur = formatNumber(trade.netProceedsEur - trade.quantity*OPEN_PRICE)
            break;
        case TradeSide.CLOSE_EXPIRATION:
        case TradeSide.CLOSE_EXERCISE:
            trade.realizedPLEur = formatNumber(unclosedQty*OPEN_PRICE * -1)
            break;
    
        default:
            break;
    }
    
    trade.unclosed = unclosedQty;
    trade.openPriceEur = OPEN_PRICE;
    trade.side = side as string;


    return trade;

}

const saveTrade = (trade:Trade) => {

    R.write(()=>{
        R.create("Trade",trade,UpdateMode.Modified)
    })
}

export const runFifoUpdate = async () => {
    TRADES = [];
    R = await openTradeRealm();
    await setTrades();
    const accounts = getAccounts();

    for (const acc of accounts) {

        const trades = getTradesByAccount(acc)
        const symbols = getSymbols(trades);

        for (const symbol of symbols) {
            
            const symbolTrades = getTradesBySymbolSorted(symbol);
            let tIndex = 0;
            for (const t of symbolTrades) {
                const prevTrades = getPreviousTrades(symbolTrades,tIndex);
                const updated = updateFifoProps(t,prevTrades)
                saveTrade(updated);
                tIndex+=1;
            }
        }
        
    }

    R.close();

   


}