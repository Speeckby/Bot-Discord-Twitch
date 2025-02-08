module.exports = async(client, addr, port) => {
    client.fn.log(client, "starting", 'TWITCH',`Connecté à ${addr}:${port}`);
    client.fn.log(client, "starting", 'TWITCH',`Connecté en tant que ${client.twitch.username}`);
}