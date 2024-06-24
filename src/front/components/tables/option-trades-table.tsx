import { FC, useEffect } from "react"
import { IbReportParsingResult, TradesRecords } from "../../../shared/types";
import { Cell, Column,RenderMode,Table2, TableLoadingOption } from "@blueprintjs/table";

interface OptionTradesTableProps{data:TradesRecords}

export const OptionTradesTable:FC<OptionTradesTableProps> = (props:OptionTradesTableProps) => {

 

    useEffect(() => {
        console.log(props.data)
    },[props.data])

    const symbolCellRenderer = (rowIndex: number) => (
        <Cell>{props.data && props.data.symbolColumn[rowIndex]}</Cell>
    );
    const quantityCellRenderer = (rowIndex: number) => (
        <Cell>{props.data && props.data.quantityColumn[rowIndex]}</Cell>
    );
    const codeCellRenderer = (rowIndex: number) => (
        <Cell>{props.data && props.data.codeColumn[rowIndex]}</Cell>
    );

    const dateTimeCellRenderer = (rowIndex: number) => (
        <Cell>{props.data && 
            
            new Date(props.data.dateTimeColumn[rowIndex]).toLocaleString()}</Cell>
    );

    const transactionPriceCellRenderer = (rowIndex: number) => (
        <Cell>{props.data && props.data.transactionPriceColumn[rowIndex]}</Cell>
    );

    const currentOrClosingPriceCellRenderer = (rowIndex: number) => (
        <Cell>{props.data && props.data.closingPriceColumn[rowIndex]}</Cell>
    );

    const currencyCellRenderer = (rowIndex: number) => (
        <Cell>{props.data && props.data.currencyColumn[rowIndex]}</Cell>
    );
    const realizedPLCellRenderer = (rowIndex: number) => (
        <Cell>{props.data && props.data.realizedPLColumn[rowIndex]}</Cell>
    );
    const proceedsCellRenderer = (rowIndex: number) => (
        <Cell>{props.data && props.data.proceedsColumn[rowIndex]}</Cell>
    );
    const commissionsCellRenderer = (rowIndex: number) => (
        <Cell>{props.data && props.data.commissionColumn[rowIndex]}</Cell>
    );
    const netProceedsCellRenderer = (rowIndex: number) => {
        if(props.data){
            const proceeds = props.data.proceedsColumn[rowIndex]
            const fees = props.data.commissionColumn[rowIndex]
            const net = proceeds - fees
            return (<Cell>{net}</Cell>)
        }else{
            return (<Cell></Cell>)
        }

};
 
    return (

 
           
                <Table2 numRows={props.data && props.data.assetCategoryColumn.length ? props.data.assetCategoryColumn.length : 25 } 
                    className="table-wrap"
                    //    columnWidths={[90,70,200,200,100,100,100,150,null,null]}
                    // defaultColumnWidth={90}

                    minRowHeight={12}
                    maxRowHeight={18}
                    renderMode={RenderMode.BATCH_ON_UPDATE}
                    enableGhostCells={true} enableFocusedCell={true}
                    //  selectionModes={SelectionModes.ROWS_ONLY}
                    //    onSelection={onRowSelection}
                    //    bodyContextMenuRenderer = {tableContextRenderer}
                    loadingOptions={props.data && props.data.assetCategoryColumn.length ? [] : [TableLoadingOption.CELLS,TableLoadingOption.ROW_HEADERS]} 
                    >
                        <Column name="Date & Time" cellRenderer={dateTimeCellRenderer}/>
                        <Column name="Symbol" cellRenderer={symbolCellRenderer}/>
                        <Column name="Quantity" cellRenderer={quantityCellRenderer}/>
                        <Column name="Currency" cellRenderer={currencyCellRenderer}/>
                        <Column name="T. Price" cellRenderer={transactionPriceCellRenderer}/>
                        <Column name="Proceeds" cellRenderer={proceedsCellRenderer}/>
                        <Column name="Commissions" cellRenderer={commissionsCellRenderer}/>
                        <Column name="Net Proceeds" cellRenderer={netProceedsCellRenderer}/>
                        <Column name="C. Price" cellRenderer={currentOrClosingPriceCellRenderer}/>
                        <Column name="Realized PL" cellRenderer={realizedPLCellRenderer}/>
                    
                        <Column name="Trade type" cellRenderer={codeCellRenderer}/>
                        

                    
                    </Table2>
        
       
     


    )
}