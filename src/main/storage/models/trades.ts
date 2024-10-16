import { app } from "electron";
import Realm, { BSON, Configuration, RealmObjectConstructor } from "realm";
import { OptionSettlement } from "./settlements";


export class Trade extends Realm.Object {

    _id!:BSON.ObjectId;
    symbol!: string;
    quantity!: number;
    side:string;
    price!: number;
    date!: number;
    account!: string;
    fees!:number;
    currency: string;
    rate: number;
    proceeds:number;
    netProceeds:number;
    assetType: string;
    tradeType: string;
    netProceedsEur:number;
    netPriceEur:number;
    unclosed:number;
    openPriceEur: number;
    fifoOpenDateTime:number;
    fifoCloseDateTime:number;
    optionCashSettlementEur:number;
    realizedPLEur:number;
    purchaseCostEur:number;
    revenuesEur:number;

   

    
    static schema = {
      name: "Trade",
      properties: {
        _id: { type: "objectId", default: () => new BSON.ObjectId() },
        account: "string",
        date: "int",
        symbol: "string",
        quantity: "int",
        side: "string?",
        price: "double",
        fees:"double",
        currency: "string",
        rate:"double?",
        proceeds:"double",
        netProceeds:"double?",
        assetType: "string",
        tradeType: "string",
        netProceedsEur:"double?",
        netPriceEur:"double?",
        unclosed:"int?",
        openPriceEur:"double?",
        fifoOpenDateTime:"int?",
        fifoCloseDateTime:"int?",
        optionCashSettlementEur:"double?",
        realizedPLEur:"double?",
        purchaseCostEur:"double?",
        revenuesEur:"double?",
      },
      primaryKey: "_id",
    };
  }

  const localConfig: Configuration = {
    schema: [ Trade as RealmObjectConstructor<Trade>, OptionSettlement as RealmObjectConstructor<OptionSettlement> ],

    path: `${app.getPath('userData')}/trades.realm`,
    deleteRealmIfMigrationNeeded:true
};

export const openTradeRealm = async ():Promise<Realm> => {
    try {
        const realm = await Realm.open(localConfig);
        return realm;
        } catch (error) {
            console.error("Error opening realm:", error);
            return null;
            }
            };
