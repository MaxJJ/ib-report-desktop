import { DbTrade, EdsReportProps } from "../../../shared/types";
import {Builder, BuilderOptions} from "xml2js"

type Record = {
    
        IenDiena:string,
        IenVeids:string,
        Rokasnauda:boolean,
        f:boolean,
        l:boolean,
        IenKapAtsav:number,
        IenDala:number,
        IzdKapIegade:number,
        AttiecDala:number,
        NodoklisArv:number        
    
}

interface EdsSchema{

    DokDKv6:{
        $:any,
        Id:number,
        Precizejums:boolean,
        Gads:number,
        Ceturksnis:number,
        Menesis:number,
        Nerezidents:boolean,
        NmrKods:number,
        Talrunis:string,
        Epasts:string,
        Sagatavotajs:string,
        IenakumiIznemotVirtualasValutas:{Tabula:{R:Record[]}}


    }
}


class EdsObj{
    private xmlObj:EdsSchema = {DokDKv6:{

    }} as EdsSchema;

    private Data:DbTrade[];

    

    constructor(data:DbTrade[],props:EdsReportProps){
        this.Data = data;
        const root = this.xmlObj.DokDKv6
        root.$ = {
            "xmlns:xsd":"http://www.w3.org/2001/XMLSchema",
            "xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance"
        }

        root.Nerezidents = false;
        root.Precizejums = false;
        root.NmrKods = props.code;
        root.Talrunis = props.phone;
        root.Epasts = props.email;
        root.Gads = props.year;
        root.Ceturksnis = props.quarter;
        root.IenakumiIznemotVirtualasValutas = {Tabula:{R:[]}}
        this.setRecords();

    }

    private setRecords(){
        this.Data.forEach((item,index)=>{
            const record:Record = {} as Record

           
            const date = new Date(item.date)
            const dateStr = date.toISOString()
            record.IenDiena = dateStr

            if (item.assetType){
                record.IenVeids= item.assetType && item.assetType.includes("Stock") ? "A" :"C"
            }else{
                record.IenVeids="C"
            }
            

            record.Rokasnauda = false;
            record.IenKapAtsav = item.revenuesEur ? parseFloat(item.revenuesEur.toFixed(2)) : 0

            record.f=false;
            record.l = false
            record.IenDala = 0
            record.IzdKapIegade = item.purchaseCostEur ? parseFloat(item.purchaseCostEur.toFixed(2)) : 0
            record.AttiecDala = 0
            record.NodoklisArv = 0

                
            this.xmlObj.DokDKv6.IenakumiIznemotVirtualasValutas.Tabula.R.push(record)
        })
    }

    get obj(){
        return this.xmlObj
    }

}


export class EdsReportBuilder{
    private Data:DbTrade[];
    private props:EdsReportProps
    constructor(data:DbTrade[],props:EdsReportProps){
        this.Data=data;
        this.props=props;

    }

    getXml = () => {

        const xmlObj = new EdsObj(this.Data,this.props).obj
        // const options:BuilderOptions = {}
        const xml = new Builder().buildObject(xmlObj)
        return xml
    }


}