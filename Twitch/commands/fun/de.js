module.exports = {
    name: 'de',
    desc: 'Joue au dé',
    usage: 'dé',
    example: ['dé'],
    aliases: ['dé'],

    run : async(client, channel, user, args) => {
        client.twitch.say(channel, `Tu as obtenu : ${Math.floor(Math.random() * 6) + 1}`)
    }
}