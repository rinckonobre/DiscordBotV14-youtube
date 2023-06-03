import { ExtendedClient } from "./structs/ExtendedClient"
export * from "colors";
import config from "./config.json";

const client = new ExtendedClient();
client.start();

export { client, config }
