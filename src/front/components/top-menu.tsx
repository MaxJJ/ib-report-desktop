
import { AnchorButton, Button, ButtonGroup, Intent } from '@blueprintjs/core';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


export function TopMenu () {

  const navigate = useNavigate()
  const location = useLocation()


  const checkLocation = (path: string) => {
   if(location.pathname == path){
    return Intent.SUCCESS
   }else{
    return Intent.NONE
   }
    
  }

  return (
    <ButtonGroup minimal={true} large={true} >
    <Button icon="database" onClick={()=>navigate('parser')} intent={checkLocation('/parser')}>Parsing</Button>
    <Button icon="function" onClick={()=>navigate('report')} intent={checkLocation('/report')}>Report</Button>
    
</ButtonGroup>
  );
}
