import { ExtendedClient } from "./structs/ExtendedClient"
export * from "colors";
import config from "./config.json";
import path from "path";

import fs from "fs";

const client = new ExtendedClient();
client.start();

export { client, config }


