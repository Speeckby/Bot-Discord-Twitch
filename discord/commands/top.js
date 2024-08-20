const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

const sql = require("sqlite3").verbose();

module.exports = {
    name: "top",
    desc: "Obtenir le classement du serveur 🥇",
    usage: "/top",
    dm: true,
    category: "Information",
    perms: null,
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "type",
            description: "Type de classement",
            required : true ,
            choices : [
                {
                    name : "Victoires 🥇",
                    value : "victoires"
                },
                {
                    name : "Défaites 😡",
                    value : "defaites"
                },
            ]
        },
    ],

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
            db.all(`SELECT * FROM motus ORDER BY ${args.getString("type")} DESC`, (err, rows) => {
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
        for (let x = 0; x < 10; x++) {
            if(x < data.length && client.users.cache.get(data[x].id) != undefined) {
                
                chaine += `\n${x}. ${"`"}${client.users.cache.get(data[x].id).username}${"`"} : ${data[x][args.getString("type")]} ${args.getString("type")} !`
            }
            else if ( client.users.cache.get(data[x].id) === undefined ) {
                chaine += `\n${x}. ${"`"}${data[x].id}${"`"} : ${data[x][args.getString("type")]} ${args.getString("type")} !`
            }
        }

        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`Classement des ${args.getString("type")} au motus :`)
        .setDescription(chaine)
        .setTimestamp()
        .setFooter({ text: interaction.member.displayName, iconURL: interaction.user.displayAvatarURL({ format: 'jpg' }) });
        
        interaction.editReply({embeds : [embed]})
        });
    }
};
