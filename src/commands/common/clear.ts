import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/Command";

export default new Command({
    name: "limpar",
    description: "deleta mensagens do chat",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "quantidade",
            description: "O total de mensagens a serem deletadas",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    async run({interaction, options}) {
        if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return;

        interaction.deferReply({ephemeral: true})

        const amount = options.getInteger("quantidade", true);

        interaction.channel?.bulkDelete(Math.min(amount, 100), true)
        .then(deletedMessages => {
            interaction.editReply({content: `${deletedMessages.size} mensagens limpas`})
        })
        .catch(reason => {
            interaction.editReply({content: `Não foi possível deletar mensagens: \n${reason}`})
        })


    },
})