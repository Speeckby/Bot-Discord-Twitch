const sql = require("sqlite3");

const { ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    run : async(client, interaction) => {
		const account = interaction.customId.split('.')[1];
        switch (account) {
            case "help": {
                const embed = new EmbedBuilder()    
                    .setTitle("Page d'aide sur la liaison Twitch-SpeeckBot :")
                    .setDescription("Vous pouvez ici voir différents problèmes et questions fréquents sur la liaison Twitch-SpeeckBot. \n\nSi vous ne trouvez pas la réponse voulu, n'hésitez pas à demander de l'aide aux autres membres dans <#942830037219020841>.")
                    .setFields([
                        {name: "Comment lier mon compte Twitch à Discord ?", value: "Il vous suffit d'aller dans les paramètres de votre profil, puis dans l'onglet 'Connexions' puis dans 'Ajoute des comptes au profil', il faut cliquer sur le logo Twitch. **(voir le gif)**"},
                        {name: "Comment lier mon compte Twitch à SpeeckBot ?", value: "Avant de lier votre compte twitch à Discord il faut s'assurer que votre compte twitch est lié à votre compte Discord. Après avoir fait cela il faudra appuyer sur le bouton 'Connexion à Twitch', cela vous enverra sur une page d'autorisation afin d'avoir accès aux informations de votre compte. Et enfin il faudra faire /twitch afin de choisir le compte à définir comme 'compte principal' (si vous avez plusieurs comptes liés)."}

                    ])
                    .setImage("https://media.discordapp.net/attachments/1272247740788768768/1272253814082240545/discord_settings_connections_tab.gif?ex=66c43172&is=66c2dff2&hm=1d5ce09b88fd01ac0d0c40ae14ba64987000ac40e1fe486afc0f1196909b2f12&=")
                    .setColor("#5865f2")
                
                const retour = new ButtonBuilder()
                    .setCustomId(`twitch`)
                    .setLabel("Retour")
                    .setEmoji('🔙')
                    .setStyle(ButtonStyle.Primary)

                const link = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.com/oauth2/authorize?client_id=1164846942266851449&response_type=code&redirect_uri=http%3A%2F%2F194.15.36.132%3A20001%2Fconnection&scope=connections+identify")
                    .setLabel("Connexion à Twitch")
                    .setEmoji('<:twitch:1172592012122406952>')
        
                const row = new ActionRowBuilder()
                    .setComponents(retour, link)
                
                interaction.update({ embeds: [embed], components: [row] })
                break;
            } case undefined: {
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
                
                await interaction.update({embeds: [embed], components: [row]})

                break;
            }
            default:    
                const db = new sql.Database('discord/stockage.db', sql.OPEN_READWRITE, (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                });
                db.serialize(() => {
                    db.all(`UPDATE profil SET twitch_account = ? WHERE id = ?`, [account, interaction.user.id], (err, rows) => {
                        if (err) {
                            console.error(err.message);
                        }
                        db.close((err) => {
                            if (err) {
                                console.error(err.message);
                            }
                        });
                    });
                });
                const row = new ActionRowBuilder()

                for (let x = 0; x < interaction.message.components[0].components.length; x++) {
                    const button = new ButtonBuilder()

                    switch (interaction.message.components[0].components[x].customId) {
                        case "twitch.help":
                            button
                                .setCustomId(`twitch.help`)
                                .setLabel("Aide")
                                .setEmoji('💡')
                                .setStyle(ButtonStyle.Secondary)
                            break;
                        case `twitch.${account}`:
                            button
                                .setCustomId(`twitch.${account}`)
                                .setLabel(account)
                                .setEmoji('<:twitch:1172592012122406952>')
                                .setStyle(ButtonStyle.Success)
                            break;
                        case null :
                            button
                                .setURL(interaction.message.components[0].components[x].url)
                                .setLabel(interaction.message.components[0].components[x].label)
                                .setEmoji('<:twitch:1172592012122406952>')
                                .setStyle(ButtonStyle.Link)
                            break;
                        default :
                            button
                                .setCustomId(interaction.message.components[0].components[x].customId)
                                .setLabel(interaction.message.components[0].components[x].label)
                                .setEmoji('<:twitch:1172592012122406952>')
                                .setStyle(ButtonStyle.Primary)
                            break;
                    }

                    row.addComponents(button)
                }
                await interaction.update({ components: [row] });
                break;
        }
	},
};