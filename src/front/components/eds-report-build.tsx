import { FC, SyntheticEvent, useEffect, useState } from "react"
import { DbTrade, EdsReportProps, TradesFilter } from "../../shared/types"
import { Button, ButtonGroup, FileInput, InputGroup, PopoverProps, Section, SectionCard,Text} from "@blueprintjs/core"
import { SymbolFifoTable } from "./tables/symbol-fifo-table"
import {ItemPredicate, ItemRendererProps, Select } from "@blueprintjs/select";

import { DateInput3 } from "@blueprintjs/datetime2"


export const EdsReportBuild:FC<any> = () => {

    const [allData,setAllData] = useState<DbTrade[]>()
    const [data,setData] = useState<DbTrade[]>()
    const [filter,setFilter] = useState<TradesFilter>({} as TradesFilter)

    const [reportProps,setReportProps] = useState<EdsReportProps>({year:2024,
                                                                   month:1,
                                                                   quarter:1,
                                                                   name:"A.Klavinskis",
                                                                   email:"klivinsky@gmail.com",
                                                                   code:12098111241,
                                                                   phone:"+37126704438",
                                                                })

    const [file,setFile]=useState<File>()                                                          

    useEffect(() => {
        const first = allData ? false : true;
        getData(first)
        
    },[filter,reportProps])

    const getData = (isFirst=false) => {
        window.bridge.getTradesFifo(filter).then(data=>{
            const s:DbTrade[] = [];
            data.forEach(d=>{
                s.push(...d)
            })
            if(s.length){
                setData(s);
            }else{
                setData([])
            }
            
            if(isFirst){
                setAllData(s)
                }
            console.log(data)
        })
    }


    const getAccounts = () => {
        if(allData){
            return Array.from(new Set<string>(allData.map(d=>d.account)))
        }else{
            return []
        }
        
    }

    const renderAccountItem = (item: string, itemProps: ItemRendererProps<HTMLLIElement>) => {
        return (<Button key={itemProps.index} fill={true} text={item} onClick={itemProps.handleClick}></Button>)
    }

    const onAccountSelect = (item: string, event?: SyntheticEvent<HTMLElement, Event>) => {

        console.log(item)
        setFilter({...filter,account:item})


    }

    const getSymbols = () => {
        if(allData && allData.length){
            return Array.from(new Set<string>(allData.map(d=>d.symbol)))
        }else{
            return []
        }
        
    }

    const renderSymbolItem = (item: string, itemProps: ItemRendererProps<HTMLLIElement>) => {
        return (<Button key={itemProps.index} fill={true} text={item} onClick={itemProps.handleClick}></Button>)
    }

    const filterSymbols: ItemPredicate<string> = (query, symbol, index, exactMatch) => {
        const normalizedSymbol = symbol.toLowerCase();
        const normalizedQuery = query.toLowerCase();

        return normalizedSymbol.indexOf(normalizedQuery) >= 0;
    
    };

    const onSymbolSelect = (item: string, event?: SyntheticEvent<HTMLElement, Event>) => {

       
        setFilter({...filter,symbol:item})

    }

    const onFromDate = (newDate: string, isUserChange: boolean) => {
       
        const date = new Date(newDate).getTime()
        setFilter({...filter,dateFrom:date})
        setRepYear()
        
    } 
    const onToDate = (newDate: string, isUserChange: boolean) => {
        
        const date = new Date(newDate).getTime()
        setFilter({...filter,dateTo:date})
        setRepYear()
    } 

    const getPLQty = () =>{
        return data && data.length ? data.filter(d=>d.realizedPLEur > 0).length : ""
    }

    const getTotalPL = () =>{
        return data && data.length ? data.reduce((a, b) => a + b.realizedPLEur, 0) : ""

    }

    const runReportBuild = () => {
        const withPositivePL = [...data].filter(t=>t.realizedPLEur > 0)
        window.bridge.runXmlBuild(withPositivePL,file.path,reportProps)
    }

    const getQuarter = ():number => {
        if(filter && filter.dateFrom){
            const date = new Date(filter.dateFrom)
            const m = date.getMonth() + 1
            if(m>=1 && m<=3){return 1}
            if(m>=4 && m<=6){return 2}
            if(m>=7 && m<=9){return 3}
            if(m>=10 && m<=12){return 4}

        }else{
            return 0
        }
    }  
        

    const setRepYear = () => {

        if(filter.dateFrom){
            setReportProps({...reportProps,
                            year:new Date(filter.dateFrom).getFullYear(),
                            quarter:getQuarter()
                        })
        }
    }

    const onFileChange=async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        
        if (files) {
          setFile(files[0]); // Handle only the first selected file
           
        }
      };

    return (

        <div className={'edsReportLayot'}>
            <div className="filterRow">
                <Select<string> 
                className="select"
                items={getAccounts()}
                filterable={false}
                
                itemRenderer={ renderAccountItem} 
                onItemSelect={ onAccountSelect}>
               
                <Button alignText="left" fill={true} rightIcon="caret-down" text={filter && filter.account ? filter.account : 'By Account'}></Button>
                
                
                </Select>
                <Button icon="cross"onClick={()=>{setFilter({...filter,account:null})}} />

               
                <Select<string> 
                className="select ml-6"
                items={getSymbols()} 
                itemPredicate={filterSymbols}
                scrollToActiveItem={true}
                itemRenderer={ renderSymbolItem} 
                onItemSelect={ onSymbolSelect}
                
                >
                
                <Button alignText="left" fill={true} rightIcon="caret-down" text={filter && filter.symbol ? filter.symbol : 'By Instrument'}/>

                </Select>
                <Button icon="cross" onClick={()=>{setFilter({...filter,symbol:null})}} />
                

                
                <DateInput3 
                onChange={onFromDate} 
                canClearSelection={true} 
                showActionsBar={true} 
                className="ml-6"
                placeholder="Date from:"
                value={filter.dateFrom ? new Date(filter.dateFrom).toLocaleString() : ''}/>
                    
                

                <DateInput3 
                onChange={onToDate} 
                canClearSelection={true} 
                showActionsBar={true} 
                className="ml-6"
                placeholder="Date to:"
                value={filter.dateTo ? new Date(filter.dateTo).toLocaleString() : ''}/>

              



            </div>
            <div className="grid-2-cols">
                <Section title={"Summary"} className="" >
                    <SectionCard padded={true}>
                        <div className="grid-2-cols">
                            <div> Trades with positive PL</div>
                            <div> {getPLQty()}</div>
                            <div> Total PL, EUR</div>
                            <div> {getTotalPL()}</div>

                        </div>
                    </SectionCard>
                </Section>

                <Section title={"EDS Report"} className="" >
                    <SectionCard padded={true}>
                        {filter.dateFrom && filter.dateTo && filter.account ? (
                        <div className="grid-2-cols">
                            <Text>Year</Text>
                            <InputGroup 
                            value={reportProps.year.toFixed()}
                            onValueChange={(v)=>setReportProps({...reportProps,year:parseInt(v)})}
                            ></InputGroup>

                            <Text>Quarter</Text>
                            <InputGroup 
                            value={reportProps.quarter.toFixed()}
                            onValueChange={(v)=>setReportProps({...reportProps,quarter:parseInt(v)})}
                            ></InputGroup>

                            <Text>Name</Text>
                            <InputGroup 
                            value={reportProps.name}
                            onValueChange={(v)=>setReportProps({...reportProps,name:v})}
                            ></InputGroup>

                            <Text>Personal Code</Text>
                            <InputGroup 
                            value={reportProps.code.toFixed()}
                            onValueChange={(v)=>setReportProps({...reportProps,code:parseInt(v)})}
                            ></InputGroup>

                            <Text>Phone</Text>
                            <InputGroup 
                            value={reportProps.phone}
                            onValueChange={(v)=>setReportProps({...reportProps,phone:v})}
                            ></InputGroup>

                            <Text>Email</Text>
                            <InputGroup 
                            value={reportProps.email}
                            onValueChange={(v)=>setReportProps({...reportProps,email:v})}
                            ></InputGroup>
                        
                        <FileInput
                           
                            inputProps={{accept:".xml,.txt"}}
                            text={file?.name}
                            buttonText="Browse"
                            
                            hasSelection={true}
                            onInputChange={onFileChange}
                            fill={true}
                        />
                        <Button 
                            text={"Create EDS Report"} 
                            onClick={runReportBuild}
                            disabled={!file}></Button>
                        </div>
                        ) : (
                            <Text>Please select account and period of this report</Text>
                        )}

                    </SectionCard>
                </Section>

            </div>
            
            
            <div className="relative">
            
            <SymbolFifoTable data={data} />
            </div>
        </div>


        
    )

}