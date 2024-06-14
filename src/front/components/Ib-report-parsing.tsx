import { FC, useEffect, useState } from "react"
import { useParsingResult } from "../hooks/useParsingResult"
import { TradesRecords } from "../../shared/types"
import { InputFileParse } from "./input-file-parse"
import { Tab, Tabs, TabsExpander } from "@blueprintjs/core"
import { OptionTradesTable } from "./tables/option-trades-table"


export const IbReportParsing:FC<any> = () => {

    const data:TradesRecords = useParsingResult()

    const [selectedTabId,setSelectedTabId] = useState("summary")

    useEffect(() => {
        console.log(data)
    },[data])

    const handleTabChange = (nextTabId,prevTabId,event) => {
        setSelectedTabId(nextTabId)
    }
    return (
        <div style={{display: "flex",flexDirection: "column"}}>
        <InputFileParse></InputFileParse>

        <Tabs id="TabsExample" onChange={handleTabChange} selectedTabId={selectedTabId}>
        <Tab id="options" title="Report Summary" panel={<OptionTradesTable />} />
        <Tab id="summary" title="OptionsTrades" panel={<OptionTradesTable />} panelClassName="ember-panel" />

        <TabsExpander />
        <InputFileParse/>
        </Tabs>

        </div>
    )

}