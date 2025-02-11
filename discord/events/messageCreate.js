const config = require("../../config.json");

module.exports = async (client, message) => {
    if (message.author.bot || message.channel.type === "DM") return;
    const taille = message.content.length
    if (taille == 0) return ;
    else {
        let coeff_channel = 1;
        if (config.xp.no_xp.includes(message.channel.id)) {
            return ;
        } else if (config.xp.little_xp.includes(message.channel.id) || message.channel.type == 2 ) {
            coeff_channel = 0.3
        }

        let user = await client.db.getDiscordUser(message.author.id)

        if (user == undefined) {
            await client.db.addDiscordUser(message.author.id, message.author.username, Number(4*taille/10*Math.log(taille)/Math.sqrt(taille) * coeff_channel))
        } else {
            await client.db.updateValue("utilisateur_discord", ["xp"], [Number(4*taille/10*Math.log(taille)/Math.sqrt(taille) * coeff_channel) + user.xp], message.author.id, "idDiscord")
        }
    }
}       