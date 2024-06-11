import { BrowserWindow } from "electron";
import { AppConfig } from "./app-config";

import {readFileSync} from "fs";
import { MainAPI } from "./api/MainAPI";

export class MainApp extends AppConfig {

    API = new MainAPI();



}