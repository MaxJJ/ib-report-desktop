import { createReadStream } from 'fs';
import { createInterface } from 'readline';

export class FileParserBase{

    public async readLineByLine(path:string,applyToLine:(line:string)=>void)
    {

       
        const rl = createInterface({
            input: createReadStream(path),
            crlfDelay: Infinity, // Handle all line endings (optional)
          });
        
          for await (const line of rl) {
            // Process each line of the file here

            applyToLine(line)

          }
        
          await rl.close(); // Close the readline interface
    }


}