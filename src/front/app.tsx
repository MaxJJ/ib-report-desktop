import { FC } from "react"
import { IbReportParsing } from "./components/Ib-report-parsing";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import { TopMenu } from "./components/top-menu";
import { EdsReportBuild } from "./components/eds-report-build";


export const AppHome:FC<any> = () => {

    return (
        <div className="layout">
        <div id="menu-container">
            <TopMenu/>
        </div>
          
       <Outlet/>   
       
        <div id="bottom-container"></div>
        </div>
    )
}

export const AppWrap:FC<any> = () => {
 
    return (

        <HashRouter >
    
      <Routes >
      
        <Route path="/" element={<AppHome />}>
          <Route index element={<IbReportParsing/>} />
          <Route path="parser" element={<IbReportParsing/>} />
          <Route path="report" element={<EdsReportBuild/>} />
          <Route path="*" element={<>NOT FOUND</>} />
        </Route>

   
      </Routes>
    </HashRouter>
        



    )
}