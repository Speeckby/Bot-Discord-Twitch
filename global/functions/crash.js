module.exports = async (client, e) => {
    
    let msg = client.discord.channels.cache.get(process.env.DiscordErrorsId).send(`\`\`\`js\n${e}\n\`\`\``)
    console.error(e)
    
    client.fn.log(client, "FUNCTION", `crash error > ${msg}`)

}