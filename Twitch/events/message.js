module.exports = async(client, channel, user, content, bot) => {
    const data = content;
    

    if (!data.startsWith(client.twitch.prefix) || bot) return;

    const args = data.slice(client.twitch.prefix.length).trim().split(/ +/g);
    let command;

    // Recherche de la commande
    if(!client.twitch.commands.has(args[0])) {
        client.twitch.commands.forEach((value, key) => {
            if(key === args[0] || value.aliases.includes(args[0])) {
                command = client.twitch.commands.get(key);
            }
        })
    } else {
        command = client.twitch.commands.get(args[0])
    }
    if (!command) return ;

    // Gestion des droits
    if(command.perms === "mod" && user.badges.broadcaster !== '1' && !user.mod) {
        client.twitch.say(channel, `@${user.username}, Seulement les modos peuvent faire ça !`);
        return;
    }
    if(command.perms === "sub" && !user.subscriber) {
        client.twitch.say(channel, `@${user.username}, Tu n'es pas sub :kappa: !`);
        return;
    }
    if(command.perms === "streamer" && user.badges.broadcaster !== '1') {
        client.twitch.say(channel, `@${user.username}, Seul le streamer peut faire ça !`);
        return;
    }

    try {
        command.run(client, channel, user, args)
        client.fn.log(client, 'twitch',"TWITCH" ,`Commande ${args[0]} exécutée par ${user.username}`)
    } catch (err) {
        client.twitch.emit('Erreur',err);
    }
}