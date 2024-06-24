import { Button, ButtonGroup, FileInput, FileInputProps } from "@blueprintjs/core"
import { ipcRenderer } from "electron";
import { FC, useEffect, useState } from "react"
import { useParsingResult } from "../hooks/useParsingResult";

const propss:FileInputProps = {}

export const InputFileParse:FC<any> = () => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
   
    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      
      if (files && files.length) {
        setSelectedFile(files[0]); // Handle only the first selected file
         window.bridge.sendStartFileParsing(files.item(0).path)
      }
    };
  
    const clearSelectedFile = () => {
      setSelectedFile(null);
      // ipcRenderer.send("clearFileToRender",true)
      
      window.dispatchEvent(new Event("clearFileToRender"))
    }
  
    return (
      <div style={{ display: 'flex', maxWidth:'28rem' }}>
        <ButtonGroup>
        <FileInput
        //   inputProps={{'accept':'image/*'}}
          inputProps={{accept:'.csv'}}
          text={selectedFile ? selectedFile.name : ''}
          buttonText="Upload"
          hasSelection={true}
          onInputChange={handleInputChange}
          
          fill={true}
          />
          <Button icon="cross" onClick={clearSelectedFile}></Button>
          </ButtonGroup>

      </div>
    );
  };
  
