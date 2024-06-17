import { app } from "electron";
import Realm, { BSON, Configuration, RealmObjectConstructor } from "realm";


export class Trade extends Realm.Object {

    _id!:BSON.ObjectId;
    symbol!: string;
    quantity!: number;
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

   

    
    static schema = {
      name: "Trade",
      properties: {
        _id: { type: "objectId", default: () => new BSON.ObjectId() },
        account: "string",
        date: "int",
        symbol: "string",
        quantity: "int",
        price: "float",
        fees:"float",
        currency: "string",
        rate:"float?",
        proceeds:"float",
        netProceeds:"float?",
        assetType: "string",
        tradeType: "string",
      },
      primaryKey: "_id",
    };
  }

  const localConfig: Configuration = {
    schema: [ Trade as RealmObjectConstructor<Trade> ],
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
