import { FC, SyntheticEvent, useEffect, useState } from "react"
import { DbTrade, TradesFilter } from "../../shared/types"
import { Button, ButtonGroup, FileInput, PopoverProps, Section, SectionCard} from "@blueprintjs/core"
import { SymbolFifoTable } from "./tables/symbol-fifo-table"
import {ItemPredicate, ItemRendererProps, Select } from "@blueprintjs/select";

import { DateInput3 } from "@blueprintjs/datetime2"


export const EdsReportBuild:FC<any> = () => {

    const [allData,setAllData] = useState<DbTrade[]>()
    const [data,setData] = useState<DbTrade[]>()
    const [filter,setFilter] = useState<TradesFilter>({} as TradesFilter)

  

    useEffect(() => {
        const first = allData ? false : true;
        getData(first)
        
    },[filter])

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

        console.log(item)
        setFilter({...filter,symbol:item})

    }

    const onFromDate = (newDate: string, isUserChange: boolean) => {
        console.log(newDate)
        const date = new Date(newDate).getTime()
        setFilter({...filter,dateFrom:date})
    } 
    const onToDate = (newDate: string, isUserChange: boolean) => {
        console.log(newDate)
        const date = new Date(newDate).getTime()
        setFilter({...filter,dateTo:date})
    } 

    const getPLQty = () =>{
        return data && data.length ? data.filter(d=>d.realizedPLEur != 0).length : ""
    }

    const getTotalPL = () =>{
        return data && data.length ? data.reduce((a, b) => a + b.realizedPLEur, 0) : ""

    }



    return (

        <div className={'edsReportLayot'}>
            <div className="filterRow">
                <Select<string> 
                className="select"
                items={getAccounts()}
                filterable={false}
                
                itemRenderer={ renderAccountItem} 
                onItemSelect={ onAccountSelect}>
                <ButtonGroup fill={true}>
                <Button alignText="left" fill={true} rightIcon="caret-down" text={filter && filter.account ? filter.account : 'By Account'}></Button>
                <Button icon="cross" onClick={()=>{setFilter({...filter,account:null})}} />
                </ButtonGroup>
                </Select>
                <ButtonGroup fill={true}>
                <Select<string> 
                className="select"
                items={getSymbols()} 
                itemPredicate={filterSymbols}
                scrollToActiveItem={true}
                itemRenderer={ renderSymbolItem} 
                onItemSelect={ onSymbolSelect}
                
                >
                
                <Button alignText="left" fill={true} rightIcon="caret-down" text={filter && filter.symbol ? filter.symbol : 'By Instrument'}/>

                </Select>
                <Button icon="cross" onClick={()=>{setFilter({...filter,symbol:null})}} />
                </ButtonGroup>

                
                <DateInput3 
                onChange={onFromDate} 
                canClearSelection={true} 
                showActionsBar={true} 
                
                value={filter.dateFrom ? new Date(filter.dateFrom).toLocaleString() : ''}>
                    
                </DateInput3>

                <DateInput3 
                onChange={onToDate} 
                canClearSelection={true} 
                showActionsBar={true} 
                
                value={filter.dateFrom ? new Date(filter.dateTo).toLocaleString() : ''}>

                </DateInput3>



            </div>
            <div className="grid-2-cols">
                <Section title={"summary"} className="" >
                    <SectionCard padded={true}>
                        <div className="grid-2-cols">
                            <div> Trades with PL</div>
                            <div> {getPLQty()}</div>
                            <div> Total PL, EUR</div>
                            <div> {getTotalPL()}</div>

                        </div>
                    </SectionCard>
                </Section>

                <Section title={"EDS Report"} className="" >
                    <SectionCard padded={true}>
                        <div className="grid-2-cols">
                        <FileInput></FileInput>
                        </div>
                    </SectionCard>
                </Section>

            </div>
            
            
            <div className="relative">
            <SymbolFifoTable data={data} />
            </div>
        </div>


        
    )

}