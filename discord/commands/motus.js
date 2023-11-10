const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: "motus",
    desc: "Joue au motus 🔡",
    usage: "/suttom",
    aliases: ["suttom"],
    dm: true,
    category: "Fun / Jeux",
    perms: null,
    

    async run(client, interaction) {
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle("Commencer un motus :")
            .setDescription(`Quel est la difficulté et la taille du mot voulu ? `)

		const easy = new ButtonBuilder()
			.setCustomId('easy')
			.setLabel('10 - 11')
            .setEmoji('<easy:1171552071577767966>')
			.setStyle(ButtonStyle.Primary);

        const normal = new ButtonBuilder()
            .setCustomId('normal')
            .setLabel('7 - 8')
            .setEmoji('<:normal:1171552069329621102>')
            .setStyle(ButtonStyle.Primary);

        const hard = new ButtonBuilder()
            .setCustomId('difficile')
            .setLabel('5 - 7')
            .setEmoji("<hard:1171552066838200351>")
            .setStyle(ButtonStyle.Primary);
        
        const harder = new ButtonBuilder()
            .setCustomId('harder')
            .setLabel('3 - 4')
            .setEmoji('<harder:1171860842489335839>')
            .setStyle(ButtonStyle.Primary);

        const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Danger);
        

		const row = new ActionRowBuilder()
			.addComponents(harder,hard,normal,easy,cancel);

        const reponse = await interaction.reply({
            embeds : [embed],
            components: [row],
        });
            
        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await reponse.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            if (confirmation.customId === 'easy') {
                const mots = require('../../fichiers/mots.json');
                let mot = mots.easy
                let taille = mot.length
                let rang = parseInt(Math.random() * taille)


                let list = []
                taille = mot[rang].length
                ligne = ""
                chaine = ""
                chaine_finale = ""
                for (const x of Array(taille).keys()) {
                    ligne = ligne + "⚫"
                }
                for (const x of Array(6).keys()) {
                    chaine += ligne + "\n"
                }
                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("Motus :")
                    .setDescription(`🔴 = Lettre bien placée \n🟡 = Lettre mal placée \n 🔵 = Mauvaise lettre \n ${chaine}`)
                
                confirmation.update({
                    embeds :  [embed],
                    components : [],
                })
                
                
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({ content: 'Action annulée', components: [] });

            }
        } catch (e) {
            await interaction.editReply({ content: 'Délai de réponse dépassé', components: [] });
        }
    }
}