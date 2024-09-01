const {ApplicationCommandOptionType} = require('discord.js');
const sql = require("sqlite3")

module.exports = {
    name: "bannière",
    desc: "Changer la banniere de ton profil",
    usage: "/bannière",
    dm: false,
    category: "Utilitaires",
    perms: null,
    options : [
        {
            name: "lien",
            description: "Changer la banniere de ton profil par une image",
            type: ApplicationCommandOptionType.String,
            required: false
        }, 
        {
            name: "couleur",
            description: "Changer la banniere de ton profil par une couleur",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],

    async run(client, interaction, args) {
        const link = args.getString('lien')
        let color = args.getString('couleur')
        var reg=/^#([0-9a-f]{3}){1,2}$/i;

        const db = new sql.Database('discord/stockage.db', sql.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
        });

        
        if ((color || link) && !(color && link)) {
            if (link) {
                if ((link.startsWith('https://i.imgur.com/') && link.endsWith('.png')) || (link.startsWith('https://cdn.imgchest.com/files/') && link.endsWith('.png'))) {
        
                    db.serialize(() => {
                        db.all(`SELECT * FROM profil WHERE id = ?`, interaction.user.id, (err, rows) => {
                            if (err) {
                                console.error(err.message);
                            }

                            if (rows && rows.length > 0) {
                                db.run(`UPDATE profil SET banner = ? WHERE id = ?`, link, interaction.user.id, (err) => {
                                    if (err) {
                                        console.error(err.message);
                                    }
                                });
                            } else {
                                db.run(`INSERT INTO profil (name, id, banner) VALUES (?, ?)`,interaction.user.globalName, interaction.user.id, link, (err) => {
                                    if (err) {
                                        console.error(err.message);
                                    }
                                });
                            }
                        })
                    });
        
                    db.close((err) => {
                        if (err) {
                            console.error(err.message);
                        }
                    })

                    interaction.reply(`La bannière a bien été changée !`)
                } else {
                    interaction.reply(`Le lien n'est pas valide (/bannière pour les infos) !`)
                }
            } else {
                color.startsWith('#') ? color = color : color = `#${color}`

                if (reg.test(color)) {
    
                    db.serialize(() => {
                        db.all(`SELECT * FROM profil WHERE id = ?`, interaction.user.id, (err, rows) => {
                            if (err) {
                                console.error(err.message);
                            }

                            if (rows && rows.length > 0) {
                                db.run(`UPDATE profil SET hex = ? WHERE id = ?`, color, interaction.user.id, (err) => {
                                    if (err) {
                                        console.error(err.message);
                                    }
                                });
                            } else {
                                db.run(`INSERT INTO profil (name, id, banner) VALUES (?, ?)`,interaction.user.globalName, interaction.user.id, link, (err) => {
                                    if (err) {
                                        console.error(err.message);
                                    }
                                });
                            }
                        })
                    });
    
                    db.close((err) => {
                        if (err) {
                            console.error(err.message);
                        }
                    })
                    interaction.reply(`La couleur de la bannière a bien été changée !`)
                } else {
                    interaction.reply(`La couleur n'est pas valide (/bannière pour les infos) !`)
                }
            }
        } else if (!link && !color) {
            interaction.reply(`**Changer sa bannière de profil :** \n\n - Mettre une image : \n\n __Pré-requis :__ Être sub à la chaine ou booster du serveur.\nVous devez effctuer la commande **'/banniere'** et mettre dans le paramètre **lien** un lien direct vers votre image en png hébergée sur imgur ou imgchest. \n\n - **Mettre une couleur :** \n\n Vous devez effctuer la commande **'/banniere'** et mettre dans le paramètre **couleur** une couleur valide en hexadecimal.`)
        } else {
            interaction.reply(`Veuillez ne pas mettre deux paramètres en même temps !`)
        }
    }
}