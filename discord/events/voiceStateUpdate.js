const { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');

module.exports = async function (client, oldState, newState) {
    const id_channel = "1279903180246749255"
    client.vocal? client.vocal : client.vocal = {}
    
    if (oldState.channel?.members.size == 0 && client.vocal.hasOwnProperty(oldState.channelId)) {
        try {
            delete client.vocal[oldState.channelId];
            await oldState.guild.channels.delete(oldState.channelId);
        } catch (error) {
            console.error('Erreur lors de la suppression du salon vocal :', error);
        }
    }

    if (newState.channelId == id_channel) {
        try {
            const newVoiceChannel = await newState.guild.channels.create({
                name: `Vocal de ${newState.member.user.username}`,
                type: 2, 
                parent: newState.channel.parentId, 
                permissionOverwrites: [
                    {
                        id: newState.guild.id, 
                        allow: [PermissionFlagsBits.Connect], 
                    },
                    {
                        id: newState.member.id, 
                        allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.MoveMembers], 
                    }
                ],
            });

            await newState.member.voice.setChannel(newVoiceChannel);

            client.vocal[newVoiceChannel.id] = newState.member.id;
            const rows = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`vocal.name`)
                        .setLabel("Changer le nom")
                        .setEmoji("📝"),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`vocal.capacity`)
                        .setLabel("Changer la capacité")
                        .setEmoji("👥"),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(`vocal.private`)
                        .setLabel("Changer le mode privé")
                        .setEmoji("🔒"),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId(`vocal.delete`)
                        .setLabel("Supprimer")
                        .setEmoji("🗑️"),
                )
            newVoiceChannel.send({content : `<@${newState.member.id}>`, embeds : [new EmbedBuilder()
                .setTitle(`Paramètres du salon vocal :`)
                .setDescription("Voici les paramètres du salon que vous pouvez changer en utilisant la commande /vocal ou en réagissant aux boutons suivants:")
                .addFields(
                    { name: "Nom :", value: `${newVoiceChannel.name}`, inline: true },
                    { name: "Capacité :", value: `∞ membres${newVoiceChannel.memberCount > 1 ? "s" : ""}`, inline: true },
                    { name: "Privé :", value: `Non`, inline: true },
                )
                .setColor(client.color)], components : [rows]}
            )
        } catch (error) {
            console.error('Erreur lors de la création du salon vocal ou du déplacement :', error);
        }   
    }
}