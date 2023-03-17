import { ExtendedClient } from "./structs/ExtendedClient"
export * from "colors";

const client = new ExtendedClient();

client.start();

export { client }

client.on("ready", () => {
    console.log("Bot online".green);
})

client.on("messageCreate", (message) => {
    if (message.author.id == client.user?.id) return;

    message.reply({
        content: `Olá ${message.author.username}`
    })
})