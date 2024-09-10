import { app } from "electron";
import Realm, { BSON, Configuration, RealmObjectConstructor } from "realm";


export class OptionSettlement extends Realm.Object {

    _id!:BSON.ObjectId;
    account?:string;
    symbol?: string;
    currency?: string;
    description?:string;
    date?:number;
    amount?:number;
    rate?:number;
    amountEur?:number


   

    
    static schema = {
      name: "OptionSettlement",
      properties: {
        _id: { type: "objectId", default: () => new BSON.ObjectId() },
        account: "string",
        date: "int",
        symbol: "string",
        description: "string",
        currency: "string",
        amount: "double",
        amountEur: "double?",
        rate: "double?",
        
      },
      primaryKey: "_id",
    };
  }
