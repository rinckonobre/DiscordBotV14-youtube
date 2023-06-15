import { ActivityType, ApplicationCommandOptionType, ApplicationCommandType, PresenceStatusData, PresenceUpdateStatus, codeBlock } from "discord.js";
import { Command } from "../../structs/types/Command";

export default new Command({
    name: "atividade",
    description: "Controla a atividade de bot",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "definir",
            description: "Escolha uma mensagem a ser exibida na atividade do bot",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "mensagem",
                    description: "mensagem que será exibida na atividade",
                    type: ApplicationCommandOptionType.String,
                    maxLength: 120,
                    required: true,
                },
                {
                    name: "tipo",
                    description: "Tipo de atividade",
                    type: ApplicationCommandOptionType.Number,
                    choices: [
                        { name: "Jogando", value: 0 },
                        { name: "Transmitindo", value: 1 },
                        { name: "Ouvindo", value: 2 },
                        { name: "Assistindo", value: 3 },
                        { name: "Competindo", value: 4 },
                    ],
                },
                {
                    name: "status",
                    description: "status da presença do bot",
                    type: ApplicationCommandOptionType.String,
                    choices: Object.entries(PresenceUpdateStatus).map(([name, value]) => ({name, value}))
                }
            ]
        },
        {
            name: "limpar",
            description: "Limpa a atividade do bot",
            type: ApplicationCommandOptionType.Subcommand
        }
    ],
    async run({ client, interaction, options }){
        if (!interaction.inCachedGuild()) return;

        const bot = client.user;
        if (!bot){
            interaction.reply({ephemeral: true, content: "Ocorreu um erro ao tentar executar esse comando!"});
            return;
        }

        switch(options.getSubcommand(true)){
            case "definir":{
                const message = options.getString("mensagem", true);
                const type = options.getNumber("tipo") ?? ActivityType.Playing;
                const status = (options.getString("status") ?? "online") as PresenceStatusData;

                bot.setPresence({ status, activities: [{name: message, type}] });

                interaction.reply({
                    ephemeral: true,
                    content: `Mensagem de atividade do bot definida para: ${codeBlock(message)}`
                })
                return;
            }
            case "limpar":{
                bot.setActivity();
                interaction.reply({ ephemeral: true, content: `A atividade do bot foi limpa!` });
                return;
            }
        }
    }
})