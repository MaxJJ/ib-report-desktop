import { FC, useEffect } from "react"
import { useParsingResult } from "../../hooks/useParsingResult";
import { TradesRecords } from "../../../shared/types";
import { Cell, Column,RenderMode,Table2, TableLoadingOption } from "@blueprintjs/table";

export const OptionTradesTable:FC<any> = () => {

    const data:TradesRecords = useParsingResult()

    useEffect(() => {
        console.log(data)
    },[data])

    const fromToDates = () => {
        if(data){
            const dates = data.dateTimeColumn
            const min = Math.min(...dates)
            const minDate = new Date(min).toDateString()
            const max = Math.max(...dates)
            const maxDate = new Date(max).toDateString()

            return (<div>{`${minDate} -> ${maxDate}`}</div>)
        }
    }
    const symbolCellRenderer = (rowIndex: number) => (
        <Cell>{data && data.symbolColumn[rowIndex]}</Cell>
    );
    const quantityCellRenderer = (rowIndex: number) => (
        <Cell>{data && data.quantityColumn[rowIndex]}</Cell>
    );
    const codeCellRenderer = (rowIndex: number) => (
        <Cell>{data && data.codeColumn[rowIndex]}</Cell>
    );

    const dateTimeCellRenderer = (rowIndex: number) => (
        <Cell>{data && 
            
            new Date(data.dateTimeColumn[rowIndex]).toLocaleString()}</Cell>
    );

    const transactionPriceCellRenderer = (rowIndex: number) => (
        <Cell>{data && data.transactionPriceColumn[rowIndex]}</Cell>
    );

    const currentOrClosingPriceCellRenderer = (rowIndex: number) => (
        <Cell>{data && data.closingPriceColumn[rowIndex]}</Cell>
    );

    const currencyCellRenderer = (rowIndex: number) => (
        <Cell>{data && data.currencyColumn[rowIndex]}</Cell>
    );
    const realizedPLCellRenderer = (rowIndex: number) => (
        <Cell>{data && data.realizedPLColumn[rowIndex]}</Cell>
    );
    const proceedsCellRenderer = (rowIndex: number) => (
        <Cell>{data && data.proceedsColumn[rowIndex]}</Cell>
    );
    const commissionsCellRenderer = (rowIndex: number) => (
        <Cell>{data && data.commissionColumn[rowIndex]}</Cell>
    );
    const netProceedsCellRenderer = (rowIndex: number) => {
        if(data){
            const proceeds = data.proceedsColumn[rowIndex]
            const fees = data.commissionColumn[rowIndex]
            const net = proceeds - fees
            return (<Cell>{net}</Cell>)
        }else{
            return (<Cell></Cell>)
        }

};
 
    return (

       <div style={{display: 'flex',flexDirection: 'column',minHeight: '100%'}}>
            <div>
            {fromToDates()}
            </div>
            <div style={{position: 'relative',flex:'1 0'}}>
                <Table2 numRows={data && data.assetCategoryColumn.length ? data.assetCategoryColumn.length : 25 } 
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
                    loadingOptions={data && data.assetCategoryColumn.length ? [] : [TableLoadingOption.CELLS,TableLoadingOption.ROW_HEADERS]} 
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
        
            </div>
        </div>


    )
}