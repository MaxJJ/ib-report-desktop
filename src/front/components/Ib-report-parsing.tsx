import { FC, useEffect, useState } from "react"
import { useParsingResult } from "../hooks/useParsingResult"
import { IbReportParsingResult } from "../../shared/types"
import { InputFileParse } from "./input-file-parse"
import { Tab, TabId, Tabs, TabsExpander } from "@blueprintjs/core"
import { OptionTradesTable } from "./tables/option-trades-table"
import { IbParsingSummary } from "./tabs/ib-parsing-summary"


export const IbReportParsing:FC<any> = () => {

    const nextdata:IbReportParsingResult = useParsingResult()
    const [data,setData] = useState<IbReportParsingResult>()

    const [selectedTabId,setSelectedTabId] = useState("summary")

    useEffect(() => {
        setData(nextdata)
        const listener = ()=>{setData(null)}
        window.addEventListener("clearFileToRender",listener)
        
        return ()=>window.removeEventListener("clearFileToRender",listener)
    },[nextdata])

    const handleTabChange = (nextTabId:TabId,prevTabId:TabId,event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setSelectedTabId(nextTabId.toString())
    }
    return (
        <div >
        
        <Tabs id="ParsingResults" className={'h-full w-full pb-1 mt-6 grid-rows-auto-full'} renderActiveTabPanelOnly = {true} onChange={handleTabChange} selectedTabId={selectedTabId} animate={true}>
        <Tab id="summary" className={"relative"} title="Summary" panel={<IbParsingSummary data={data && data} />}  />
        <Tab id="options" disabled={!data} className={"relative "} title="Option Trades" panel={<OptionTradesTable data={data && data.optionsTrades} />} />
        <Tab id="stocks" disabled={!data || !data.stocksTrades} className={"relative h-full"} title="Stock Trades" panel={<OptionTradesTable data={data && data.stocksTrades} />} panelClassName="ember-panel" />

        <TabsExpander />
        <InputFileParse/>
        </Tabs>

        </div>
    )

}