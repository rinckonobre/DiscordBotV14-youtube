import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, Collection, ColorResolvable, ComponentType, EmbedBuilder, Message } from "discord.js";
import { Command } from "../../structs/types/Command";
import { setTimeout as wait } from "node:timers/promises"

const questions = [
    { id: "name", title: "Nome", question: "👤 Qual é o seu nome?" },
    { id: "age", title: "Idade", question: " 🎂 Qual é a sua idade?" },
    { id: "height", title: "Altura", question: "📏 Qual é a sua altura?" },
    { id: "color", title: "Cor favorita", question: "🎨 Qual é sua favorita?" },
    { id: "food", title: "Comida favorita", question: "🍔 Qual é a sua comida favorita?" },
    { id: "game", title: "Jogo favorito", question: "🎮 Qual é o seu jogo favorito?" },
];

export default new Command({
    name: "questionario",
    description: "Comando de questionário",
    type: ApplicationCommandType.ChatInput,
    async run({ interaction }) {
        if (!interaction.inCachedGuild()) return;

        const { member, channel } = interaction;

        if (channel?.type !== ChannelType.GuildText){
            interaction.reply({ephemeral: true, content: "Este comando não pode ser utilizado neste canal!"});
            return;
        }

        const embed = new EmbedBuilder({
            title: "Questionário",
            description: `Você receberá algumas perguntas e poderá respondê-las
            Para iniciar clique no botão`
        }).setColor("#fcc203" as ColorResolvable);

        const message = await interaction.reply({
            fetchReply: true,
            embeds: [embed],
            components: [new ActionRowBuilder<ButtonBuilder>({components: [
                new ButtonBuilder({customId: "questions-start-button", label: "Começar", style: ButtonStyle.Success})
            ]})]
        });


        const buttonInteraction = await message
        .awaitMessageComponent({componentType: ComponentType.Button})
        .catch(() => null);

        if (!buttonInteraction) return;

        interface Answer {
            title: string,
            answer: string
        }

        const answers: Collection<string, Answer> = new Collection();
        const filter = (m: Message) => m.author.id == member.id;

        const quest = async (steps = 0) => {
            if (steps < questions.length){
                const current = questions[steps];

                embed.setDescription(`> ${current.question}`)
                .setFooter({
                    text: `Pergunta ${steps + 1} de ${questions.length}` +
                    "\nDigite cancelar a qualquer momento para cancelar!"
                })

                await interaction.editReply({embeds: [embed]});

                const messages = await channel.awaitMessages({filter, max: 1}).catch(() => null);
                const msg = messages?.first();
                
                if (!messages || !msg) return;
                if (msg.content.toLowerCase() == "cancelar"){
                    embed.setDescription("O questionário foi cancelado!")
                    .setFooter(null);
                    interaction.editReply({embeds: [embed]});
                    return;
                }

                answers.set(current.id, {title: current.title, answer: msg.content});
                embed.setDescription("Sua resposta foi salva... \nPróxima pergunta!")
                msg.delete().catch(() => {});

                await wait(2000)
                quest(steps + 1);
                return;
            }
            embed.setDescription("Todas as respostas foram registradas!")
            .setFields(answers.map(({title, answer}) => ({name: title, value: answer})))
            .setFooter(null);

            interaction.editReply({embeds: [embed]});
        }


        await buttonInteraction.update({components: []})
        quest();
    },
})