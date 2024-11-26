module.exports = {
    name: 'ban',
    desc: 'Bannir un utilisateur',
    usage: 'ban <username> <reason>',
    example: ['ban arvix Spam in chat', 'ban @arvix Spam in chat'],
    perms: "mod", 

    run : async(client, channel, user, args) => {
        if(!args[1]) {
            return client.twitch.say(channel, `@${user.username},Veuillez spécifer un utilisateur !`)
        } else {
            const target = args[1].replace("@",'');
            args.shift(); args.shift();
            client.twitch.ban(channel, target, args.join(" ")).then(res => {
                client.twitch.say(channel, `@${user.username}, L'utilisateur ${target} à été banni de la chaine`)
            }).catch((e) => {
                client.twitch.say(channel, `@${user.username}, Une erreure à été rencontrée ! ${e.error}`)
            })

        }
    }
}