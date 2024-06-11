export interface IBridge{

    send:(channel:string, ...args: any[])=>void;
    invoke:(channel:string, ...args: any[])=>Promise<any>;

    parseFile:(args:ParseFileRequestArgs)=>Promise<ParseFileResponse>;



}

export enum AppChannels{
    parseFile="parseFile",
}

export type ParseFileRequestArgs = string;

export type ParseFileResponse = [

]