import { Results, UpdateMode } from "realm";
import { Trade, openTradeRealm } from "../storage/models/trades";
import {parseString} from 'xml2js';

export const runToEuroRateUpdater = async ()=>{



    const r = await openTradeRealm()
    const trades= r.objects('Trade').filtered("rate == $0",null).toJSON() as unknown as Trade[];
    for (const trade of trades) {
        
         trade.rate = trade.currency == "EUR" ? 1 : await getRate({...trade}.currency as string, {...trade}.date as number)
         
         trade.netProceedsEur = Math.round((trade.netProceeds / trade.rate) * 100) / 100
         trade.netPriceEur = Math.abs(Math.round(trade.netProceedsEur / trade.quantity * 100) / 100)
      
    }

    r.write(()=>{
        for (const trade of trades) {
     
          r.create("Trade", trade,UpdateMode.Modified)
            
       }
    })

    r.close()

}

export const lbUrl = "https://www.bank.lv/vk/ecb.xml?date="

export type CRates = {Currency:{ID:string[],Rate:string[]}[]}[]

export const parseXML = async (xml:string):Promise<CRates> => {
    let result:CRates = null;
    return new Promise((resolve,reject) => {
        parseString(xml,(err,res) => {
            // console.log(JSON.stringify(res))
            result = res.CRates.Currencies;
            resolve(result)
            
        })
    })


    
}

export const getRate = async (currency: string,date: number)=> {

    const d = new Date(date);

    const year = d.getFullYear().toString().padStart(4, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const day = d.getDate().toString().padStart(2, '0');

    const dateString = year+ month+ day
    
    const url = lbUrl + dateString

    const response = await fetch(url)

   

    const rates:CRates = await parseXML(await response.text())

    const currencyRate = rates[0].Currency.filter(r=> r.ID.includes(currency))
    
    return parseFloat(currencyRate[0].Rate[0])
  
}

// https://www.bank.lv/vk/ecb.xml?date=20050323 
// (async () => {
//     try {
//       const res = await fetch('https://jsonplaceholder.typicode.com/users');
//       const headerDate = res.headers && res.headers.get('date') ? res.headers.get('date') : 'no response date';
//       console.log('Status Code:', res.status);
//       console.log('Date in Response header:', headerDate);
  
//       const users = await res.json();

//       res.text
  
//       for(user of users) {
//         console.log(`Got user with id: ${user.id}, name: ${user.name}`);
//       }
//     } catch (err) {
//       console.log(err.message); //can be console.error
//     }
//   })();