module.exports = async(client, channel, user, content, self) => {
    const data = content;
    //console.log(user)
    const args = data.slice(client.prefix.length).trim().split(/ +/g);

    if (!data.startsWith(client.prefix)) {
        return;
    }
    let command;
    if(!client.commands.has(args[0])) {
        client.commands.forEach((value, key) => {
            if(key === args[0] || value.aliases.includes(args[0])) {
                command = client.commands.get(key);
            }
        })
    } else {
        command = client.commands.get(args[0])
    }
    //const command = client.commands.find(cmd => cmd.aliases.includes(args[0])) || client.commands.get(args[0]);
    if (!command) {
        return ;
    }
    if(!command.botNotAllowed && self) {
        return;
    }
    console.log(user.badges.broadcaster !== '1')
    if(command.perms === 'owner') {
        if(!client.config.owners.includes(user.username)) {
            client.say(channel, `@${user.username}, tu n'es pas autorisé à faire cela !`);
            return;
        }
    }
    if(command.perms === "mod" && user.badges.broadcaster !== '1') {
        if(!user.mod) {
            client.say(channel, `@${user.username}, Seulement les modos peuvent faire ça !`);
            return;
        }
    }
    if(command.perms === "sub") {
        if(!user.subscriber) {
            client.say(channel, `@${user.username}, Tu n'es pas sub :kappa: !`);
            return;
        }
    }
    if(command.perms === "streamer") {
        if(user.badges.broadcaster !== '1') {
            client.say(channel, `@${user.username}, Seul le streamer peut faire ça !`);
            return;
        }
    }
    try {
        command.run(client, channel, content, user, args)
    } catch (err) {
        client.emit('Erreur',err);
    }
}