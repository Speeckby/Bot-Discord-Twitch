const {ApplicationCommandOptionType} = require('discord.js');
const sql = require("sqlite3")

module.exports = {
    name: "badge",
    desc: "Changer les badges du profil",
    usage: "/badge",
    dm: false,
    category: "Utilitaires",
    perms: null,
    options : [
        {
            name: "ordre",
            description: "Changer l'ordre des badges",  
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],            

    async run(client, interaction, args) {
        await interaction.deferReply()
        if (interaction.guild.id != "942827648009273364") return interaction.editReply({content: "Cet utilitaire n'est pas disponible dans ce serveur", ephemeral: true})
        let badge = args.getString('ordre')
        let badges = []
        let badges_link = []
        let badge_inv = []
        let profil;

        const member = interaction.guild.members.cache.get(interaction.user.id)
        let halloween = ["670558004017496064", "774756792038457354", "817730920768602132", "885152848143327255", "493029571013247015", "744329133126975520", "1020053727677263892"]
        let liste_badge = { "discord" : "discord_logo.png", "twitch" : "twitch_logo.png", "halloween" : "pumpkin_1.png", "vip" : "vip.png", "fonda" : "fonda.png", "sub" : "sub.png", "mod" : "mod.png" }
        let liste_desc = { "discord" : "<:discord:1279900281588678696> : Être membre du Discord", "twitch" : "<:twitch:1279900269739642952> : Être follow à la chaîne Twitch", "halloween" : "<:pumpkin:1279900289314328618> : Avoir participé à l'event halloween 2023", "vip" : "<:vip:1279900390388666411> : Être VIP", "fonda" : "<:fonda:1279900303550054522> : Être fondateur ", "sub" : "<:sub:1279900312043389031> : Être sub à la chaîne", "mod" : "<:mod:1279900296750825583> : Faire parti du staff" }   
        const db = new sql.Database('discord/stockage.db', sql.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
        });

        await new Promise((resolve, reject) => db.serialize(() => {
            db.all(`SELECT * FROM profil WHERE id = ?`, interaction.user.id, (err, rows) => {
                if (err) {
                    console.error(err.message);
                }
                if (rows && rows.length > 0) {
                    profil = true
                    if (halloween.includes(interaction.user.id.toString())) badge_inv.push('halloween');
                    if (member) {           
                        badge_inv.push('discord')    
                        const roles = member.roles.cache.map(role => role.id);
            
                        if (roles.includes('1064882468299227206')) badge_inv.push('vip')
                        if (roles.includes('1064879470542082158')) badge_inv.push('fonda')
                        if (roles.includes('1279391680373723187')) badge_inv.push('mod')
                        if (roles.includes('1056177696775884870')) badge_inv.push('sub')
                    } 
                    db.all(`SELECT * FROM twitch WHERE pseudo = ? `, rows[0].twitch_account, async (err, rows2) => {
                        if (err) {
                            console.error(err.message);
                        }

                        if (rows2 && rows2.length > 0) {
                            if (rows2[0].follow) badge_inv.push('twitch')
                        }
                    })
                } else {
                    profil = false
                    if (halloween.includes(interaction.user.id.toString())) badge_inv.push('halloween');
                    if (member) {           
                        badge_inv.push('discord')    
                        const roles = member.roles.cache.map(role => role.id);
            
                        if (roles.includes('1064882468299227206')) badge_inv.push('vip')
                        if (roles.includes('1064879470542082158')) badge_inv.push('fonda')
                        if (roles.includes('1279391680373723187')) badge_inv.push('mod')
                        if (roles.includes('1056177696775884870')) badge_inv.push('sub')
                        
                    } 
                }
                resolve();
            })
        }))
        if (badge) {
            badge = badge.split('$')
            for (const elm of badge) {
                if (liste_badge[elm]) {
                    if (!badge_inv.includes(elm)) {
                        return interaction.editReply("Tu ne possèdes pas le badge  : ``" + elm + "``");
                    }
                    badges.push(elm);
                    badges_link.push(liste_badge[elm]);
                } else {
                    return interaction.editReply("Le badge ``" + elm + "`` n'existe pas");
                }
            }

            if (profil) {
                db.serialize(() => {
                    db.run(`UPDATE profil SET badge = ? WHERE id = ?`, badges_link.join(','), interaction.user.id, (err) => {
                        if (err) {
                            console.error(err.message);
                        }
                    })
                })
            } else {
                db.serialize(() => {
                    db.run(`INSERT INTO profil (name, id, badge) VALUES (?, ?)`, interaction.user.globalName ,interaction.user.id, badges_link.join(','), (err) => {
                        if (err) {
                            console.error(err.message);
                        }
                    })
                })
            }
            db.close((err) => {
                if (err) {  
                    console.error(err.message);
                }
            })

            interaction.editReply("Tu as bien changé tes badges !")
        } else {
            let text = ""
            badge_inv.forEach(elm => {
                text += elm + " " +liste_desc[elm] + "\n"
            })
            interaction.editReply({ ephemeral: true, content: "**Comment changer mes badges ?**\n\n il vous suffit de faire /badge et de mettre dans le paramètre 'option' l'ordre des badges que vous possédez de la forme ``badge1$badge2$badge3...``. \nExemple : ``/badge discord$vip$fonda``\n PS: vous pouvez avoir max 5 badges, et si vous ne mettez pas tout vos badges ils se mettront automatiquement à la fin.\n\n **Liste de tes badges :** \n" + text })
        }
    }
}