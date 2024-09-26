import { Trade, openTradeRealm } from "../storage/models/trades";
export class FifoCalculator {

    private Open:{price:number,quantity:number}[] = [];
    

    public openTrade(trade:Trade){
        const quantity = trade.quantity
        // const price = Math.floor((trade.netProceedsEur / quantity)*10000) / 10000
        const price = trade.netProceedsEur / quantity
       
        this.Open.push({price:price,quantity:quantity})
        console.log("Open",trade.symbol,this.Open)
    }

 

    public closeGetPL(trade:Trade){
        const side = trade.quantity > 0 ? "closeBuy" : "closeSell";
        const Close:{price:number,quantity:number}[] = [];
        // let diff = Math.abs(this.Open[0].quantity)-Math.abs(trade.quantity)
        const f = (tail:number,ix:number)=>{
            try {

                const diff = Math.abs(this.Open[ix].quantity)-Math.abs(tail)
                console.log("f: symbol,tail,diff,ix",trade.symbol,tail,diff,ix);
                if(diff == 0){
                    Close.push({price:this.Open[ix].price,quantity:Math.abs(tail)})
                    this.Open[ix].quantity = 0
                }
                else if(diff < 0){
                    Close.push({price:this.Open[ix].price,quantity:Math.abs(this.Open[ix].quantity)})
                    this.Open[ix].quantity = 0
                  
                        f(Math.abs(diff),ix+=1)
                 
                    
                }
                else if(diff > 0){
                    Close.push({price:this.Open[ix].price,quantity:Math.abs(tail)})
                    this.Open[ix].quantity = (Math.abs(this.Open[ix].quantity)-tail)*Math.sign(this.Open[ix].quantity)
                }
    
                console.log("f: symbol,open",trade.symbol,this.Open);
                console.log("f: symbol,close",trade.symbol,Close);
                
            } catch (error) {
               console.log("f: error",error);
               console.log("f: error symbol,ix,open,close",trade.symbol,ix,this.Open,Close);
            }


           
        }

        f(Math.abs(trade.quantity),0)

        this.Open = this.Open.filter(t=>t.quantity!=0)

        let PL = 0;
        let cost = 0
        Close.forEach(t=>{
            cost+=Math.abs(t.price*t.quantity)
        })

        if(side=="closeBuy"){
            PL = cost-Math.abs(trade.netProceedsEur)
        }
        else if(side=="closeSell"){
           PL =  Math.abs(trade.netProceedsEur) - cost
        }

        return PL
 
    }


}