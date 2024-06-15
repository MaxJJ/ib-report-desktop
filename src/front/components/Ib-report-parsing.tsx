import { FC, useEffect, useState } from "react"
import { useParsingResult } from "../hooks/useParsingResult"
import { IbReportParsingResult, TradesRecords } from "../../shared/types"
import { InputFileParse } from "./input-file-parse"
import { Classes, Tab, TabId, Tabs, TabsExpander } from "@blueprintjs/core"
import { OptionTradesTable } from "./tables/option-trades-table"
import { IbParsingSummary } from "./tabs/ib-parsing-summary"


export const IbReportParsing:FC<any> = () => {

    const data:IbReportParsingResult = useParsingResult()

    const [selectedTabId,setSelectedTabId] = useState("options")

    useEffect(() => {
        console.log(data)
    },[data])

    const handleTabChange = (nextTabId:TabId,prevTabId:TabId,event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setSelectedTabId(nextTabId.toString())
    }
    return (
        <div >
        
        <Tabs id="ParsingResults" className={'h-full w-full pb-1'} onChange={handleTabChange} selectedTabId={selectedTabId} animate={true}>
        <Tab id="summary" className={"relative"} title="Summary" panel={<IbParsingSummary data={data && data} />}  />
        <Tab id="options" className={"relative h-full"} title="Option Trades" panel={<OptionTradesTable data={data && data.optionsTrades} />} />
        <Tab id="stocks" className={"relative h-full"} title="Stock Trades" panel={<OptionTradesTable data={data && data.stocksTrades} />} panelClassName="ember-panel" />

        <TabsExpander />
        <InputFileParse/>
        </Tabs>

        </div>
    )

}