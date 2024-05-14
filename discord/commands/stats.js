const Discord = require('discord.js')
const { EmbedBuilder } = require('discord.js')
const sql = require('sqlite3')

module.exports = {
    name: "stats",
    desc: "Obtenir tes stats au motus",
    usage: "/stats",
    dm: false,
    category: "Information",
    perms: null,

    async run(client, interaction, args) {
        await interaction.deferReply();
        let data = [];
        let db = new sql.Database('discord/stockage.db', sql.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Requête en cours au fichier db ...');
        });

        db.serialize(() => {
            db.all(`SELECT * FROM motus WHERE id = ?`, interaction.user.id, (err, rows) => {
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
        
        let vd = 0
        if (data[0].defaites ==0 ) {
            vd = data[0].victoires
        }else {
            vd = data[0].victoires / data[0].defaites
        }
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `Stats du motus de ${interaction.user.username} :`,
            })
            .addFields(
                {
                name: " ",
                value: `**Défaites** : ${data[0].defaites} \n**Victoires** : ${data[0].victoires} \n**V/D** : ${vd.toFixed(2)}`,
                inline: false
                },
                {
                name: " ",
                value: `<:easy:1171552071577767966> **Easy** : ${data[0].easy}\n<:hard:1171552066838200351> **Difficile** : ${data[0].hard}`,
                inline: true
                },
                {
                name: " ",
                value: `<:normal:1171552069329621102> **Normal** : ${data[0].harder}\n<:harder:1171860842489335839> **Très difficile** : ${data[0].harder}`,
                inline: true
                },
            )
            .setThumbnail(interaction.user.displayAvatarURL({ format: 'jpg' }))
            .setColor(client.color)
        
        interaction.editReply({embeds : [embed]})
        });
    }
}