import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, CollectedInteraction, Collection, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, italic, time } from "discord.js";
import { Command } from "../../structs/types/Command";

const members: Collection<string, string> = new Collection();

const verifyModal = new ModalBuilder({
    customId: "verify-code-modal",
    title: "Verificação",
    components: [
        new ActionRowBuilder<TextInputBuilder>({components: [
            new TextInputBuilder({
                customId: "verify-code-input",
                label: "Código de verificação",
                placeholder: "Insira o código de verificação",
                style: TextInputStyle.Short,
                required: true
            })
        ]}),
    ]
})

export default new Command({
    name: "verificar",
    description: "Realiza uma verificação padrão",
    type: ApplicationCommandType.ChatInput,
    async run({ interaction }){
        if (!interaction.inCachedGuild()) return;
        
        const { member, guild } = interaction;

        const role = guild.roles.cache.find(r => r.name == "Verificado");
        if (!role){
            interaction.reply({ephemeral: true, content: "Cargo não configurado!"});
            return;
        }

        if (member.roles.cache.has(role.id)){
            interaction.reply({ephemeral: true, content: "Você já está verificado!"});
            return;
        }

        if (members.has(member.id)){
            interaction.showModal(verifyModal);
            return;
        }

        const code = randomText();
        const timestamp = new Date(Date.now() + 30000);

        await interaction.reply({
            ephemeral: true,
            embeds: [
                new EmbedBuilder({
                    title: "Sistema de verificação",
                    description: `Você precisará digitar o código a seguir: ||${code}||
                    Copie e cole no formulário que será exibido
                    
                    ${italic(`O código expira ${time(timestamp, "R")}`)}
                    > Clique no botão abaixo para verificar`
                })
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>({components: [
                    new ButtonBuilder({customId: "verify-code-button", label: "Verificar", style: ButtonStyle.Success})
                ]})
            ]
        })

        members.set(member.id, code);
        setTimeout(() => members.delete(member.id), 30_000);
    },
    buttons: new Collection([
        ["verify-code-button", async (interaction) => {
            if (!interaction.inCachedGuild()) return;

            const { member, guild } = interaction;

            const role = guild.roles.cache.find(r => r.name == "Verificado");
            if (!role){
                interaction.update({content: "Cargo não configurado!", embeds: [], components: []});
                return;
            }

            if (member.roles.cache.has(role.id)){
                interaction.update({content: "Você já está verificado!", embeds: [], components: []});
                return;
            }

            if (!members.has(member.id)) {
                interaction.update({content: `Utilize o comando \`/verificar\` novamente!`, embeds: [], components: []})
            }

            interaction.showModal(verifyModal);
        }]
    ]),
    modals: new Collection([
        ["verify-code-modal", async (interaction) => {
            if (!interaction.inCachedGuild()) return;

            const { member, guild, fields } = interaction;
            const code = members.get(member.id);
            const inputCode = fields.getTextInputValue("verify-code-input");

            if (!code || code !== inputCode){
                interaction.reply({ephemeral: true, content: "Código inválido ou expirado! Utilize \`/verificar\`!"})
                return;
            }

            const role = guild.roles.cache.find(r => r.name == "Verificado");
            if (!role){
                interaction.reply({ephemeral: true, content: "Cargo não configurado!"});
                return;
            }

            members.delete(member.id);
            await member.roles.add(role);

            interaction.reply({
                ephemeral: true, content: `Você foi verificado com sucesso! \nRecebeu o cargo ${role}`
            });
        }]
    ])
})

function alternateCapitals(str: string){
    return [...str].map((char, i) => char[`to${i % 2 ? "Upper" : "Lower"}Case`]()).join("");
}

function randomText(){
    return alternateCapitals(Math.random().toString(36).substring(2, 8))
}