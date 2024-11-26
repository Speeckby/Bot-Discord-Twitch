module.exports = async(client, channel, user, content, bot) => {
    const data = content;
    const args = data.slice(client.twitch.prefix.length).trim().split(/ +/g);

    if (!data.startsWith(client.twitch.prefix) || bot) {
        return;
    }
    let command;
    if(!client.twitch.commands.has(args[0])) {
        client.twitch.commands.forEach((value, key) => {
            if(key === args[0] || value.aliases.includes(args[0])) {
                command = client.twitch.commands.get(key);
            }
        })
    } else {
        command = client.twitch.commands.get(args[0])
    }
    if (!command) {
        return ;
    }
    if(command.perms === 'owner') {
        if(!client.twitch.config.owners.includes(user.username)) {
            client.twitch.say(channel, `@${user.username}, tu n'es pas autorisé à faire cela !`);
            return;
        }
    }
    if(command.perms === "mod" && user.badges.broadcaster !== '1') {
        if(!user.mod) {
            client.twitch.say(channel, `@${user.username}, Seulement les modos peuvent faire ça !`);
            return;
        }
    }
    if(command.perms === "sub") {
        if(!user.subscriber) {
            client.twitch.say(channel, `@${user.username}, Tu n'es pas sub :kappa: !`);
            return;
        }
    }
    if(command.perms === "streamer") {
        if(user.badges.broadcaster !== '1') {
            client.twitch.say(channel, `@${user.username}, Seul le streamer peut faire ça !`);
            return;
        }
    }
    try {
        command.run(client, channel, user, args)
    } catch (err) {
        client.twitch.emit('Erreur',err);
    }
}