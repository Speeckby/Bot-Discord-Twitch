const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { createCanvas, Image, GlobalFonts} = require('@napi-rs/canvas');
const { request } = require('undici');


const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');
	let fontSize = 70;

	do {
		context.font = `${fontSize -= 10}px minecraft`;
	} while (context.measureText(text).width > canvas.width - 300);

	return context.font;
};

module.exports = {
    name: "profil",
    desc: "Regarder le profil d'un membre",
    usage: "/profil",
    dm: false,
    category: "Information",
    perms: null,
    
    async run(client,interaction,args) {
		GlobalFonts.registerFromPath('fichiers/minecraft.ttf', 'minecraft')
		const canvas = createCanvas(700, 250);
		const context = canvas.getContext('2d');

		context.fillStyle = '#2b2d31';
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.font = '28px minecraft';
		context.fillStyle = '#ffffff';
		context.fillText('Profil : ', canvas.width / 2.5, canvas.height / 3.5);

		context.font = applyText(canvas, `${interaction.member.displayName}!`);
		context.fillStyle = '#ffffff';
		context.fillText(`${interaction.member.displayName}`, canvas.width / 2.5, canvas.height / 1.8);

		// Configuration du cercle pour la pp

		context.beginPath();
		context.arc(125, 125, 100, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();

		// Importation de la pp

		const { body } = await request(interaction.user.displayAvatarURL({ format: 'jpg' }));
		const avatar = new Image();
		avatar.src = Buffer.from(await body.arrayBuffer());
		context.drawImage(avatar, 25, 25, 200, 200);

		// défini l'image comme une pièce-jointe

		const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profil.png' });

		// Affiche l'image

		const embed = new EmbedBuilder()
			.setColor('#2b2d31')
			.setImage('attachment://profil.png');

		interaction.reply({ files: [attachment], embeds: [embed] });
	}
};
