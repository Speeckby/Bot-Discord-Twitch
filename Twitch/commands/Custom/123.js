module.exports = {
    name: '123',
    desc: 'Dire qqchose',
    usage: '123',

    run : async (client, channel) => {
        client.twitch.say(channel, "M A L A I S E")
    }
}