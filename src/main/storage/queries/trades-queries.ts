import { BrowserWindow } from "electron";
import { AppChannels, IbReportParsingResult, MainProcessStatus, OptionCashSettlementRecords, TradesRecords, TradesSavingProgress } from "../../../shared/types";
import { Trade, openTradeRealm } from "../models/trades";
import { runToEuroRateUpdater } from "../../workers/toEuro";
import { runFifoUpdate } from "../../workers/fifoUpdate";
import { OptionSettlement } from "../models/settlements";

export class TradesQueries{

    private Data:IbReportParsingResult

    constructor(data:IbReportParsingResult){
        this.Data = data;
    }

    private async tradesRecordsToModels(records:TradesRecords): Promise<Trade[]>{
        const trades = records.dateTimeColumn.map((dt,ix) => {
            const trade = {} as Trade;
            trade.date = records.dateTimeColumn[ix];
            trade.account = this.Data.account
            trade.symbol = records.symbolColumn[ix];
            trade.fees = records.commissionColumn[ix];
            trade.proceeds = records.proceedsColumn[ix];
            trade.quantity = records.quantityColumn[ix];
            trade.netProceeds = trade.proceeds + trade.fees;
            trade.price= records.transactionPriceColumn[ix];
            trade.currency = records.currencyColumn[ix];
            trade.assetType = records.assetCategoryColumn[ix];
            trade.tradeType = records.codeColumn[ix];

            return trade
           
        })

        return trades

    }

    private async cashSettlementToModels(records:OptionCashSettlementRecords): Promise<OptionSettlement[]>{
        
        const settlements = records.dateTimeColumn.map((dt,ix) => {
            const settlement = {} as OptionSettlement;
            settlement.account = this.Data.account
            settlement.date = records.dateTimeColumn[ix]
            settlement.description = records.descriptionColumn[ix]
            settlement.amount = records.amountColumn[ix]
            settlement.currency = records.currencyColumn[ix]
            settlement.symbol=records.symbolColumn[ix]
            


            return settlement
           
        })

        return settlements

    }

    public async saveOptionTrades(){
        const records = this.Data.optionsTrades;

        
       
        const trades = await this.tradesRecordsToModels(records);

        const stockTradesRecords = this.Data.stocksTrades
        const stockTrades = await this.tradesRecordsToModels(stockTradesRecords);

        trades.push(...stockTrades)

        //////////////////////
        const settlementRecords = this.Data.optionsCashSettlement

        console.log("Settlements Records: ",JSON.stringify(settlementRecords))
        const settlements = settlementRecords.dateTimeColumn ? await this.cashSettlementToModels(settlementRecords) : [];
        //////////////////////

        const r = await openTradeRealm();

        const dbTrades = r.objects('Trade');
        const dbSettlements = r.objects('OptionSettlement');

        const checkForDuplicate= (trade:Trade) => {
            const sameSymbol = dbTrades.filtered("symbol == $0",trade.symbol);

            return sameSymbol.filtered("date == $0",trade.date).length == 0

        }

        const checkSettlementForDuplicate= (settlement:OptionSettlement) => {
            const sameSymbol = dbSettlements.filtered("symbol == $0",settlement.symbol);
            if(sameSymbol.length == 0){return true}
            return sameSymbol.filtered("date == $0",settlement.date).length == 0

        }

        if(r){
            r.write(
                 
                () => {
                    const progress = {} as TradesSavingProgress
                    for (const trade of trades) {
                    
                    if(checkForDuplicate(trade)){
                       const t =  r.create("Trade",trade,true);
                       progress.status = MainProcessStatus.FINISHED
                       progress.message = `Trade saved successfully`
                       progress.trade = {...t};
                       BrowserWindow.getFocusedWindow().webContents.send(AppChannels.tradeSavingProgress,progress)
                    }else{
                        progress.status = MainProcessStatus.IN_PROGRESS
                        progress.message = `Trade already exists`
                        BrowserWindow.getFocusedWindow().webContents.send(AppChannels.tradeSavingProgress,progress)
                    }
                    
                }

                for (const settlement of settlements) {
                    
                    if(checkSettlementForDuplicate(settlement)){
                       const s =  r.create("OptionSettlement",settlement,true);
                       progress.status = MainProcessStatus.FINISHED
                       progress.message = `Option Cash Settlement saved successfully`
                       
                       BrowserWindow.getFocusedWindow().webContents.send(AppChannels.tradeSavingProgress,progress)
                    }else{
                        progress.status = MainProcessStatus.IN_PROGRESS
                        progress.message = `Trade already exists`
                        BrowserWindow.getFocusedWindow().webContents.send(AppChannels.tradeSavingProgress,progress)
                    }
                    
                }

                progress.status = MainProcessStatus.COMPLETED
                progress.message = `All trades saved successfully`
                BrowserWindow.getFocusedWindow().webContents.send(AppChannels.tradeSavingProgress,progress)

            }
            );

            r.close()

            await runToEuroRateUpdater()
            runFifoUpdate()
        }
    }


    }
