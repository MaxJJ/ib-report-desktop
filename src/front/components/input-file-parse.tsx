import { Button, FileInput, FileInputProps } from "@blueprintjs/core"
import { ipcRenderer } from "electron";
import { FC, useEffect, useState } from "react"
import { useParsingResult } from "../hooks/useParsingResult";

const propss:FileInputProps = {}

export const InputFileParse:FC<any> = () => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
   
    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      console.log('FILES!:',files)
      if (files) {
        setSelectedFile(files[0]); // Handle only the first selected file
        // const result = await window.bridge.parseFile(files.item(0).path)

        window.bridge.sendStartFileParsing(files.item(0).path)
        
        
        // console.log(result)
      }
    };
  
    const handleRemoveFile = () => {
      setSelectedFile(null);
    };
  
    return (
      <div style={{ display: 'flex' }}>
        <FileInput
        //   inputProps={{'accept':'image/*'}}
          inputProps={{accept:'.csv'}}
          text={selectedFile?.name}
          buttonText="Upload Image"
          hasSelection={true}
          onInputChange={handleInputChange}
          fill={true}
          />
        {selectedFile && (
          <Button onClick={handleRemoveFile} intent="danger" style={{ marginTop: 10 }}>
            Select
          </Button>
        )}
      </div>
    );
  };
  
