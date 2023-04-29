import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, GuildMember, MessageFlags, VoiceChannel, channelLink } from "discord.js";
import { Command } from "../../structs/types/Command";

export default new Command({
    name: "example",
    description: "example command",
    type: ApplicationCommandType.ChatInput,
    async run({ interaction }){
        if (!interaction.inCachedGuild()) return;
        const { member } = interaction;
        
        interaction.reply({content: "Hello " + member});
    }
});