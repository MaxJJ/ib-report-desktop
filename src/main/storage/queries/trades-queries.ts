import { BrowserWindow } from "electron";
import { AppChannels, IbReportParsingResult, MainProcessStatus, TradesRecords, TradesSavingProgress } from "../../../shared/types";
import { Trade, openTradeRealm } from "../models/trades";
import { runToEuroRateUpdater } from "../../workers/toEuro";

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
            trade.netProceeds = trade.proceeds - trade.fees;
            trade.price= records.transactionPriceColumn[ix];
            trade.currency = records.currencyColumn[ix];
            trade.assetType = records.assetCategoryColumn[ix];
            trade.tradeType = records.codeColumn[ix];

            return trade
           
        })

        return trades

    }

    public async saveOptionTrades(){
        const records = this.Data.optionsTrades;
        const trades = await this.tradesRecordsToModels(records);

        const r = await openTradeRealm();

        const dbTrades = r.objects('Trade');

        const checkForDuplicate= (trade:Trade) => {
            const sameSymbol = dbTrades.filtered("symbol == $0",trade.symbol);

            return sameSymbol.filtered("date == $0",trade.date).length == 0

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

                progress.status = MainProcessStatus.COMPLETED
                progress.message = `All trades saved successfully`
                BrowserWindow.getFocusedWindow().webContents.send(AppChannels.tradeSavingProgress,progress)

            }
            );

            r.close()

            runToEuroRateUpdater()
        }
    }


    }
