module.exports = {
    name : "raconte",
    desc : "Raconte pas ta vie",
    usage : "raconte <username>",
    example : ["r arvix", "r @arvix"],
    aliases : ["r"], 

    run : async(client, channel, user, args) => {
        if(!args[1]) {
            return client.say(channel, `@${user.username},Veuillez spécifer un utilisateur !`)
        } else {
            const target = args[1].replace("@",'');
            args.shift(); args.shift();
            client.twitch.say(channel, `Raconte pas ta vie @${target} stp :)! (Signé ${user.username})`)
        }
    }
}