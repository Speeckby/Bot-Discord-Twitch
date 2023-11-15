const Discord = require('discord.js');
const { handleTalk } = require("../util.js");

module.exports = async (client, message) => {
    
    noMention = true
    if (message.author.bot || message.channel.type === Discord.ChannelType.DM) return;
    const mentionCheck = (message.content.startsWith(`<@${message.client.user.id}>`) || message.content.startsWith(`<@!${message.client.user.id}>`));
    if (mentionCheck || noMention) {
       handleTalk(client,message)
        
    }

}