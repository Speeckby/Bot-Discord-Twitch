const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js");

const sql = require("sqlite3").verbose();

module.exports = {
    run: async(client,interaction) => {
        if (interaction.values[0].split('.')[0] === 'motus') {
            let texte = ""
            if (interaction.values[0].split('.')[1] === 'defaites') {
                texte = 'défaites'
            } else if (interaction.values[0].split('.')[1] === 'easy') {
                texte = 'victoires en facile'
            } else if (interaction.values[0].split('.')[1] === 'normal') {
                texte = 'victoires en normal'
            } else if (interaction.values[0].split('.')[1] === 'hard') {
                texte = 'victoires en difficile'
            } else if (interaction.values[0].split('.')[1] === 'harder') {
                texte = 'victoires en harder'
            } else {
                texte = 'victoires'
            } 
            let data = [];
            let db = new sql.Database('discord/stockage.db', sql.OPEN_READWRITE, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Requête en cours au fichier db ...');
            });

            db.serialize(() => {
                db.all(`SELECT * FROM motus ORDER BY ${interaction.values[0].split('.')[1]} DESC`, (err, rows) => {
                    if (err) {
                        console.error(err.message);
                    }
                    // rows est maintenant un tableau trié par motus de manière décroissante
                    data = rows;
                });
            });

            db.close((err) => {
                if (err) {
                    console.error(err.message);
                }
            let chaine = ""
            let place = ""
            for (let x = 0; x < 10; x++) {
                if (x == 0) {
                    place = "🥇"
                } else if (x == 1) {
                    place = "🥈"
                } else if (x == 2) {
                    place = "🥉"
                } else {
                    place = x + 1
                }
                if(x < data.length && client.users.cache.get(data[x].id) != undefined) {
                    chaine += `\n${place}. **${client.users.cache.get(data[x].id).username}** - ${data[x][interaction.values[0].split('.')[1]]} ${texte} !`
                }
                else if ( client.users.cache.get(data[x].id) === undefined ) {
                    chaine += `\n${place}. **${data[x].id}** - ${data[x][interaction.values[0].split('.')[1]]} ${texte} !`
                }
            }

            const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`Classement des ${texte} au motus :`)
            .setDescription(chaine)
            .setTimestamp()
            .setFooter({ text: interaction.member.displayName, iconURL: interaction.user.displayAvatarURL({ format: 'jpg' }) });
            
            const select = new StringSelectMenuBuilder()
                .setCustomId('top')
                .setPlaceholder('Faire une suggestion !')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Victoires')
                        .setDescription("Classement des victoires !")
                        .setEmoji('🏆')
                        .setValue('motus.victoire'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Défaites')
                        .setDescription('Classement des défaites !')
                        .setEmoji('👎')
                        .setValue('motus.defaites'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Victoires en facile')
                        .setDescription('Classement des victoires en facile !')
                        .setEmoji('<:easy:1171552071577767966>')
                        .setValue('motus.easy'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Victoires en normal')
                        .setDescription('Classement des victoires en normal !')
                        .setEmoji('<:normal:1171552069329621102>')
                        .setValue('motus.normal'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Victoires en difficile')
                        .setEmoji('<:hard:1171552066838200351>')
                        .setDescription("Classement des victoires en difficile !")
                        .setValue('motus.hard'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Victoires en harder')
                        .setEmoji('<:harder:1171860842489335839>')
                        .setDescription("Classement des victoires en harder !")
                        .setValue('motus.harder'),
                );
            const row = new ActionRowBuilder().addComponents(select)


            interaction.update({embeds : [embed], components : [row]})
            });
        }
    }
}