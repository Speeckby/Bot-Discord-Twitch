const sql = require("sqlite3")
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js")

module.exports = {
    name: "twitch",
    desc: "Lier son compte Twitch pour le bot.",
    usage: "/twitch",
    dm: true,
    category: "Information",
    perms: null,

    async run(client, interaction, args) {
        await interaction.deferReply( { ephemeral: true } );

        const db = new sql.Database('discord/stockage.db', sql.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
        });
  
        let embed = new EmbedBuilder()
        const row = new ActionRowBuilder()

        await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all("SELECT twitch_accounts, twitch_account FROM profil WHERE id = ?", [interaction.user.id], (err, rows) => { 
                    if (err) {
                        reject(err.message);
                    }
                    if (rows && rows.length > 0) {
                        if (rows[0].twitch_accounts == null && rows[0].twitch_account == null) {
                            embed.title = ""
                            embed.color = "#5865f2"
                            embed.setDescription("Veuillez lier votre compte Twitch")
                            
                            resolve();
                        } else if(rows[0].twitch_accounts == null && rows[0].twitch_account != null) {

                            embed.setTitle("Choisissez votre compte principal Twitch :")
                            embed.setColor("#5865f2")
                            embed.setDescription("Le compte choisi sera celui utilisé dans les commandes et les statistiques. \n\n ⚠️ Si votre compte ne s'affiche pas, veuillez d'abord le lier à votre compte Discord puis cliquer sur le dernier bouton en bas. ⚠️ (si vous ne savez pas comment faire faites appuyer sur le bouton d'aide)")
                            embed.addFields({name: `${rows[0].twitch_account}`, value :"oui"})
                            const compte = new ButtonBuilder()
                                .setStyle(ButtonStyle.Success)
                                .setCustomId(`twitch.` + rows[0].twitch_account)
                                .setLabel(rows[0].twitch_account)
                                .setEmoji('<:twitch:1172592012122406952>')

                            row.addComponents(compte)

                        } else if (rows[0].twitch_accounts != null && rows[0].twitch_account == null) {

                            embed.setTitle("Choisissez votre compte principal Twitch :")
                            embed.setColor("#5865f2")
                            embed.setDescription("Le compte choisi sera celui utilisé dans les commandes et les statistiques. \n\n ⚠️ Si votre compte ne s'affiche pas, veuillez d'abord le lier à votre compte Discord puis cliquer sur le dernier bouton en bas. ⚠️ (si vous ne savez pas comment faire faites appuyer sur le bouton d'aide)")
                            for (let x = 0; x < rows[0].twitch_accounts.split(",").length; x++) {
                                embed.addFields({name: `${rows[0].twitch_accounts.split(",")[x]}`, value :"non"})
                                const compte = new ButtonBuilder()
                                    .setCustomId(`twitch.` + rows[0].twitch_accounts.split(",")[x])
                                    .setLabel(rows[0].twitch_accounts.split(",")[x])
                                    .setEmoji('<:twitch:1172592012122406952>')
                                    .setStyle(ButtonStyle.Primary)
    
                                row.addComponents(compte)
                            }
                        } else {
                            embed.setTitle("Choisissez votre compte principal Twitch :")
                            embed.setColor("#5865f2")
                            embed.setDescription("Le compte choisi sera celui utilisé dans les commandes et les statistiques. \n\n ⚠️ Si votre compte ne s'affiche pas, veuillez d'abord le lier à votre compte Discord puis cliquer sur le dernier bouton en bas. ⚠️ (si vous ne savez pas comment faire faites appuyer sur le bouton d'aide)")
                            for (let x = 0; x < rows[0].twitch_accounts.split(",").length; x++) {
                                const compte = new ButtonBuilder()

                                if (rows[0].twitch_accounts.split(",")[x] == rows[0].twitch_account) {
                                    embed.addFields({name: `${rows[0].twitch_accounts.split(",")[x]}`, value :"oui"})
                                    compte.setStyle(ButtonStyle.Success)
                                } else {
                                    embed.addFields({name: `${rows[0].twitch_accounts.split(",")[x]}`, value :"non"})
                                    compte.setStyle(ButtonStyle.Primary)
                                }

                                compte
                                    .setCustomId(`twitch.` + rows[0].twitch_accounts.split(",")[x])
                                    .setLabel(rows[0].twitch_accounts.split(",")[x])
                                    .setEmoji('<:twitch:1172592012122406952>')
    
                                row.addComponents(compte)
                            }
                        }
                        const aide = new ButtonBuilder()
                        aide.setCustomId("twitch.help")
                        aide.setLabel("Aide")
                        aide.setEmoji("💡")
                        aide.setStyle(ButtonStyle.Secondary)
                        row.addComponents(aide)
                        resolve();
                    } 
                });
            });
        });    
       
        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
        });
        const link = new ButtonBuilder()
            .setLabel("Connexion à Twitch")
            .setURL("https://discord.com/oauth2/authorize?client_id=1164846942266851449&response_type=code&redirect_uri=http%3A%2F%2F194.15.36.132%3A20001%2Fconnection&scope=connections+identify")
            .setEmoji("🔗")
            .setStyle(ButtonStyle.Link)

        row.addComponents(link)
        
        await interaction.editReply({embeds: [embed], components: [row]})
    }
}