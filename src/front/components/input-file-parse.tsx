import { Button, FileInput, FileInputProps } from "@blueprintjs/core"
import { FC, useEffect, useState } from "react"

const propss:FileInputProps = {}

export const InputFileParse:FC<any> = () => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      console.log('FILES!:',files)
      if (files) {
        setSelectedFile(files[0]); // Handle only the first selected file
        window.bridge.parseFile(files.item(0).path)
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
  
