import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, ColorResolvable, EmbedBuilder } from "discord.js";
import { Command } from "../../structs/types/Command";
import { config } from "../..";

export default new Command({
    name: "example",
    description: "example command",
    type: ApplicationCommandType.ChatInput,
    async run({ interaction, options }){
        if (!interaction.inCachedGuild()) return;

        const { member, channel } = interaction;

        interaction.deferReply({ephemeral: true});
        if (channel?.type !== ChannelType.GuildText) return;

        const messages = await channel.awaitMessages({filter: m => m.author.id == member.id, max: 1});
        console.log(messages);
    }
});