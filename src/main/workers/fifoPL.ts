import { Trade, openTradeRealm } from "../storage/models/trades";
export class FifoCalculator {

    private Open:{price:number,quantity:number}[] = [];
    

    public openTrade(trade:Trade){
        const quantity = trade.quantity
        const price = trade.netProceedsEur / quantity
        this.Open.push({price:price,quantity:quantity})
    }

 

    public closeGetPL(trade:Trade){
        const side = trade.quantity > 0 ? "closeBuy" : "closeSell";
        const Close:{price:number,quantity:number}[] = [];
        const f = (tail:number,ix:number)=>{
            try {

                const diff = Math.abs(this.Open[ix].quantity)-Math.abs(tail)
     
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
    
                
            } catch (error) {
               console.log("f: error",error);
              
            }


           
        }

        f(Math.abs(trade.quantity),0)

        this.Open = this.Open.filter(t=>t.quantity!=0)

        let PL = 0;
        let cost = 0
        let purchaseCost = 0
        let revenuesEur = 0
        Close.forEach(t=>{
            cost+=Math.abs(t.price*t.quantity)
        })

        if(side=="closeBuy"){
            PL = cost-Math.abs(trade.netProceedsEur)
            revenuesEur = cost
            purchaseCost = Math.abs(trade.netProceedsEur)
        }
        else if(side=="closeSell"){
           PL =  Math.abs(trade.netProceedsEur) - cost
           revenuesEur = Math.abs(trade.netProceedsEur)
           purchaseCost = cost
        }

        return {PL,purchaseCost,revenuesEur}
 
    }


}