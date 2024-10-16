import { FC, useEffect } from "react"
import { DbTrade } from "../../../shared/types";
import { Cell, Column,RenderMode,RowHeaderCell,RowHeaderRenderer,Table2, TableLoadingOption } from "@blueprintjs/table";
import { Intent } from "@blueprintjs/core";

interface SymbolFifoTableProps{data:DbTrade[],onComplete?:()=>void}

export const SymbolFifoTable:FC<SymbolFifoTableProps> = (props:SymbolFifoTableProps) => {

 

    useEffect(() => {
        console.log(props.data)
    },[])

    const isData = ()=>{
        return props.data && props.data.length > 0
    }

    const getRowIntent = (rowIndex:number)=>{
        if(isData()){
        if(props.data[rowIndex].realizedPLEur > 0){
            return Intent.SUCCESS
        }
        if(props.data[rowIndex].realizedPLEur < 0){
            return Intent.DANGER
        }
        if(props.data[rowIndex].unclosed == 0){
            return Intent.WARNING
        }
    }
    return Intent.NONE
    }
    const getDateString = (rowIndex: number) => {
        return isData() ? new Date(props.data[rowIndex].date).toLocaleString() : null
    }

    const dateTimeCellRenderer = (rowIndex: number) => (
        
        <Cell  intent={getRowIntent(rowIndex)}>{isData() && getDateString(rowIndex)}</Cell>
    );

    const symbolCellRenderer = (rowIndex: number) => (
        <Cell  intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].symbol}</Cell>
    );
    const quantityCellRenderer = (rowIndex: number) => (
      
        <Cell  intent={getRowIntent(rowIndex)} >
           
            {isData() && props.data[rowIndex].quantity}
   
           
        </Cell>

    );
    const priceCellRenderer = (rowIndex: number) => (
        <Cell  intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].price}</Cell>
    );
    const currencyCellRenderer = (rowIndex: number) => (
        <Cell intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].currency}</Cell>
    );
    const tradeTypeCellRenderer = (rowIndex: number) => (
        <Cell intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].side}</Cell>
    );
    const proceedsCellRenderer = (rowIndex: number) => (
        <Cell intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].proceeds}</Cell>
    );
    const commissionsCellRenderer = (rowIndex: number) => (
        <Cell intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].fees}</Cell>
    );
    const eurRateCellRenderer = (rowIndex: number) => (
        <Cell intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].rate}</Cell>
    );
    const netProceedsCellRenderer = (rowIndex: number) => (
        <Cell intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].netProceedsEur}</Cell>
    );
    const unclosedBeforeCellRenderer = (rowIndex: number) => (
        <Cell intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].unclosed}</Cell>
    );
    const avgOpenPriceCellRenderer = (rowIndex: number) => (
        <Cell intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].openPriceEur}</Cell>
    );
    const purchaseCostEurCellRenderer = (rowIndex: number) => (
        <Cell intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].purchaseCostEur != 0 ? props.data[rowIndex].purchaseCostEur : ''}</Cell>

    );
    const optionCashSettlementEurCellRenderer = (rowIndex: number) => (
        <Cell intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].optionCashSettlementEur!= 0 ? props.data[rowIndex].optionCashSettlementEur : ''}</Cell>

    );
    const revenuesEurCellRenderer = (rowIndex: number) => (
        <Cell intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].revenuesEur!= 0 ? props.data[rowIndex].revenuesEur : ''}</Cell>

    );
    const realizedPLEurCellRenderer = (rowIndex: number) => (
        <Cell intent={getRowIntent(rowIndex)}>{isData() && props.data[rowIndex].realizedPLEur != 0 ? props.data[rowIndex].realizedPLEur : ''}</Cell>

    );

    const rowHeaderCellRenderer:RowHeaderRenderer = (rowIndex: number) => {
        if(props.data && props.data.length){
        let header = props.data[rowIndex].symbol;
        const prevHeader = rowIndex > 0 ? props.data[rowIndex - 1].symbol : 'XXX';
       
        if(header == prevHeader && props.data[rowIndex].unclosed != 0) {
            header = ''
        }


        return (<RowHeaderCell name={header}></RowHeaderCell>)
    }else{
        return (<RowHeaderCell name={''}></RowHeaderCell>)
    }
    }
 
    return (

 
           
                <Table2 numRows={isData() ? props.data.length : 25 } 
                    
                    className="table-wrap"
                    //    columnWidths={[90,70,200,200,100,100,100,150,null,null]}
                    // defaultColumnWidth={90}
                    // onCompleteRender={props.onComplete}
                    // minRowHeight={12}
                    // maxRowHeight={18}
                    enableRowHeader={true}
                    rowHeaderCellRenderer={rowHeaderCellRenderer}
                    enableColumnHeader={true}
                    enableRowResizing={true}
                    renderMode={RenderMode.BATCH_ON_UPDATE}
                    enableGhostCells={true} enableFocusedCell={true}
                    //  selectionModes={SelectionModes.ROWS_ONLY}
                    //    onSelection={onRowSelection}
                    //    bodyContextMenuRenderer = {tableContextRenderer}
                    loadingOptions={isData() && props.data.length ? [] : [TableLoadingOption.CELLS,TableLoadingOption.ROW_HEADERS]} 
                    >
                        <Column name="Date & Time"  cellRenderer={dateTimeCellRenderer}/>
                        <Column name="Symbol" cellRenderer={symbolCellRenderer}/>
                        <Column name="Quantity" cellRenderer={quantityCellRenderer}/>
                        
                        <Column name="Price" cellRenderer={priceCellRenderer}/>
                        <Column name="Currency" cellRenderer={currencyCellRenderer}/>
                        <Column name="Trade type" cellRenderer={tradeTypeCellRenderer}/>
                        <Column name="UnclosedBefore" cellRenderer={unclosedBeforeCellRenderer}/>
                        <Column name="Proceeds" cellRenderer={proceedsCellRenderer}/>
                        <Column name="Commissions" cellRenderer={commissionsCellRenderer}/>
                        <Column name="EUR rate" cellRenderer={eurRateCellRenderer}/>
                        <Column name="Net Proceeds/EUR" cellRenderer={netProceedsCellRenderer}/>
                        {/* <Column name="Avg. open price/EUR" cellRenderer={avgOpenPriceCellRenderer}/> */}

                        <Column name="Purchase Cost, EUR" cellRenderer={purchaseCostEurCellRenderer}/>
                        <Column name="Option Cash Settlement, EUR" cellRenderer={optionCashSettlementEurCellRenderer}/>
                        <Column name="Revenues, EUR" cellRenderer={revenuesEurCellRenderer}/>
                        <Column name="Realized PL, EUR" cellRenderer={realizedPLEurCellRenderer}/>
                    
                       
                        

                    
                    </Table2>
        
       
     


    )
}