module.exports = async (client, e) => {

    // if (e.startsWith("DiscordAPIError[50007]: Cannot send messages to this user")) return console.error(`Un message n'a pas pu être envoué`)

    let msg = client.channels.cache.get(process.env.DiscordErrorsId).send(`\`\`\`js\n${e}\n\`\`\``)
    console.error(e)
    
    client.fn.log(client, "FUNCTION", `crash error > ${msg}`)

}