import { DbTrade, TradesFilter } from "../../../shared/types";
import { Trade, openTradeRealm } from "../models/trades";

export const GetTradesFifo = async (filter:TradesFilter = null):Promise<DbTrade[][]> => {

    const R = await openTradeRealm();

    let allTrades = R.objects("Trade").sorted('date');
    
    if(filter){
        
            allTrades = filter.account ? allTrades.filtered("account = $0",filter.account) : allTrades;
            allTrades = filter.symbol ? allTrades.filtered("symbol = $0",filter.symbol) : allTrades;
            allTrades = filter.dateFrom ? allTrades.filtered("date >= $0",filter.dateFrom) : allTrades;
            allTrades = filter.dateTo ? allTrades.filtered("date <= $0",filter.dateTo) : allTrades;
    }

    const trades:Trade[] = allTrades.toJSON() as unknown as Trade[];

    const accounts = Array.from(new Set(trades.map(trades => trades.account)))
    const symbols = Array.from(new Set(trades.map(trades => trades.symbol)))

    const result:DbTrade[][] = []
    for (const acc of accounts) {
        const accTrades = trades.filter(trade=> trade.account == acc)
        for (const sym of symbols) {
            const symTrades = accTrades.filter(trade=> trade.symbol == sym)
            result.push(symTrades)

        }

        
    }

    R.close();
   return result

}