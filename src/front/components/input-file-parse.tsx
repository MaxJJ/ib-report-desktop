import { Button, FileInput, FileInputProps } from "@blueprintjs/core"
import { ipcRenderer } from "electron";
import { FC, useEffect, useState } from "react"
import { useParsingResult } from "../hooks/useParsingResult";

const propss:FileInputProps = {}

export const InputFileParse:FC<any> = () => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
   
    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      
      if (files) {
        setSelectedFile(files[0]); // Handle only the first selected file
         window.bridge.sendStartFileParsing(files.item(0).path)
      }
    };
  
  
    return (
      <div style={{ display: 'flex', maxWidth:'28rem' }}>
        <FileInput
        //   inputProps={{'accept':'image/*'}}
          inputProps={{accept:'.csv'}}
          text={selectedFile?.name}
          buttonText="Upload"
          hasSelection={true}
          onInputChange={handleInputChange}
          fill={true}
          />

      </div>
    );
  };
  
