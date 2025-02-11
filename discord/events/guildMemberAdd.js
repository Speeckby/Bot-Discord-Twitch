module.exports = async (client, member) => {
    // Ajout du membre dans la db
    let user = await client.db.getDiscordUser(member.id)

    if (user == undefined) {
        await client.db.addDiscordUser(member.id, member.username, Number(4*taille/10*Math.log(taille)/Math.sqrt(taille) * coeff_channel))
    }
}