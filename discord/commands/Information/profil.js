const { AttachmentBuilder, ApplicationCommandOptionType } = require('discord.js');
const { createCanvas, Image, GlobalFonts, loadImage} = require('@napi-rs/canvas');
const liste_level = require('../../../global/fichiers/level.json');
let halloween = ["670558004017496064", "774756792038457354", "817730920768602132", "885152848143327255", "493029571013247015", "744329133126975520", "1020053727677263892"]

function Back2line(ctx, text, x, y, width, height) {
	text = text.split(" ");
	let text2= "";
	for (let i = 0; i < text.length; i++) {
		let text2_temp = text2 + text[i];
		if (ctx.measureText(text2_temp).width > width) {
			ctx.fillText(text2, x, y);
			y += height;
			text2 = text[i] + " ";
		} else {
			text2 = text2_temp + " ";
		}
	}
	ctx.fillText(text2, x, y);
}

function RoundRect(ctx, x, y, width, height, radius, contour = false) {
	let radius2 = radius;
	while (radius2 > height / 2) {
		radius2 = width / 2;
	}
	
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y); // Départ en haut à gauche après le premier arrondi
    ctx.arcTo(x + width, y, x + width, y + height, radius2); // Coin supérieur droit
    ctx.arcTo(x + width, y + height, x, y + height, radius2); // Coin inférieur droit
    ctx.arcTo(x, y + height, x, y, radius); // Coin inférieur gauche
    ctx.arcTo(x, y, x + width, y, radius); // Coin supérieur gauche
    ctx.closePath();
	contour? ctx.stroke() : ctx.fill();
}

function textZone(context, text, posx, posy, maxWidth, fontSize, minfontSize) {
    context.font = `bold ${fontSize}px rounded`;

    // On réduit la taille de la police si nécessaire pour adapter le texte à la largeur maximale
    while (context.measureText(text).width > maxWidth && fontSize > minfontSize) {
        fontSize -= 1;
        context.font = `bold ${fontSize}px rounded`;
    }

    // Si le texte ne rentre toujours pas, on ajoute "..."
    if (context.measureText(text).width > maxWidth) {
        while (context.measureText(text + '...').width > maxWidth) {
            text = text.slice(0, -1);
        }
        text += '...';
    }

    // Calculer la position verticale pour centrer le texte
    const textMetrics = context.measureText(text);
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    const y = posy + (textHeight / 2); // Centre verticalement dans la zone

    // Dessiner le texte
    context.fillText(text, posx, y);
}

module.exports = {
    name: "profil",
    desc: "Regarder le profil d'un membre",
    usage: "/profil",
	options : [
		{
			type : ApplicationCommandOptionType.User,
			name : "membre",
			description : "Membre à voir le profil",
			required : false
		}
	],
    
    async run(client,interaction,args) {
		await interaction.deferReply()
		
		let user = args.getUser('membre') || interaction.user
		user = await interaction.client.users.fetch(user.id, { force: true });

		const member = interaction.guild.members.cache.get(user.id)

		let twitch = "Pas de twitch connecté --> /twitch"
		let badge = 770
		let badges = []

		GlobalFonts.registerFromPath('fichiers/font/Simply Rounded Bold.ttf', 'rounded')
		GlobalFonts.registerFromPath('fichiers/font/Multipolar-Bold.ttf', 'multipolar')
		const canvas = createCanvas(1360, 960); 
		const context = canvas.getContext('2d');
		context.shadowOffsetX = 10; // Décalage de l'ombre en X
		context.shadowOffsetY = 10; // Décalage de l'ombre en Y
		context.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Couleur et opacité de l'ombre
		context.lineWidth = 10
		context.strokeStyle = '#290a10'	


		

		context.fillStyle = '#18191c';
		context.fillRect(0, 480, canvas.width, canvas.height-480);
		
		const db = new sql.Database('discord/stockage.db', sql.OPEN_READWRITE, (err) => {
			if (err) {
				console.error(err.message);
			}
		});
		await new Promise((resolve, reject) => {
			db.serialize(() => {
				db.all(`SELECT * FROM profil JOIN xp ON profil.id = xp.profil_id WHERE id = ? `, user.id, async (err, rows) => {
					if (err) {
						console.error(err.message);
						reject(err);
						return null
					}
					if (rows && rows.length > 0) {
						if (rows[0].twitch_account) twitch = "Aucune information trouvée pour ce compte --> /twitch"
						if (rows[0].badge)	{
							badges = rows[0].badge.split(",")
						}
						let banner = rows[0].hex

						if (member) {
							if (!badges.includes('discord_logo.png')) badges.push('discord_logo.png');
				
							const roles = member.roles.cache.map(role => role.id);
				
							if (roles.includes('1064882468299227206') && !badges.includes('vip.png')) badges.push('vip.png');
							if (roles.includes('1064879470542082158') && !badges.includes('fonda.png')) badges.push('fonda.png');
							if (roles.includes('1279391680373723187') && !badges.includes('mod.png')) badges.push('mod.png');
							if (roles.includes('1056177696775884870')) {
								if (rows[0].banner) banner = rows[0].banner
								if (!badges.includes('sub.png')) badges.push('sub.png')
							} 
						}
						var reg=/^#([0-9a-f]{3}){1,2}$/i;
						if (user.accentColor && !user.banner && banner == null) {
							const hexAccentColor = `#${user.accentColor.toString(16).padStart(6, '0')}`;
							context.save();
							context.fillStyle = hexAccentColor;
							context.rect(0, 0, 1360, 480);
							context.fill();
							context.restore();
						} else if (user.banner && banner == null) {
							const bannier = await loadImage(`https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=1024`);
							context.drawImage(bannier, 0, 0, 1360, 480);
						} else if (banner == null) {
							context.save();
							context.fillStyle = "#231620";
							context.rect(0, 0, 1360, 480);
							context.fill();
							context.restore();
						} else if (reg.test(banner)) {
							context.save();
							context.fillStyle = banner;
							context.rect(0, 0, 1360, 480);
							context.fill();
							context.restore();
						} else {
							const bannier = await loadImage(banner);
							context.drawImage(bannier, 0, 0, 1360, 480);
						}

						context.fillStyle = '#290a10'
						context.shadowBlur = 25;
						RoundRect(context, 600, 600, 700, 60, 30);
						context.shadowBlur = 0;
						context.fillStyle = '#383c41';
						RoundRect(context, 610, 610, 680, 40, 20);
						context.font = '30px "multipolar"';
						if (rows[0].xp_requis < 1000) {
							context.fillText( `/${rows[0].xp_requis}`, 1230, 595);
						} else {
							let text_requis = rows[0].xp_requis / 100
							context.fillText( `/${text_requis.toFixed(1)}k`, 1230, 595);
						}

						context.fillStyle = '#e9e9e9';
						if (rows[0].xp_level < 1000) {
							context.fillText( `${parseInt(rows[0].xp_level)}`, 1230-Math.floor(context.measureText(`${parseInt(rows[0].xp_level)}`).width), 595);
						} else {
							let text_xp = parseInt(rows[0].xp_level) / 1000
							context.fillText(`${text_xp.toFixed(1)}k`, 1230-Math.floor(context.measureText(`${text_xp.toFixed(1)}k`).width), 595);
						}
						context.fillText( `Niveau ${rows[0].level}`, 1275-Math.floor(context.measureText(`Niveau ${rows[0].level}`).width), 695);
					
						context.fillStyle = '#5865f2';
						RoundRect(context, 610, 610, rows[0].xp_level * 680 / rows[0].xp_requis, 40, 20);
						db.all(`SELECT * FROM twitch WHERE pseudo = ? `, rows[0].twitch_account, async (err, rows2) => {
							if (err) {
								console.error(err.message);
								reject(err);
								return null
							}
							if (rows2 && rows2.length > 0) {
								twitch = false
								context.fillStyle = '#18191c' //Couleur zone texte stat
								RoundRect(context, 50, 700, 500, 200, 30, true);
								RoundRect(context, 230, 690, 141, 20, 0);

								context.fillStyle = '#290a10' // Couleur zone xp twitch
								context.shadowBlur = 25;
								RoundRect(context, 600, 770, 700, 60, 30);
								context.shadowBlur = 0;
								context.fillStyle = '#383c41'; // Couleur zone xp twitch
								RoundRect(context, 610, 780, 680, 40, 20);

								context.font = '30px "multipolar"'; // Police d'écriture nombres
								let level_prec = liste_level[rows2[0].level - 1]? liste_level[rows2[0].level - 1] : 0
								let wizebot_xp_requis = liste_level[rows2[0].level] - level_prec
								let wizebot_xp = rows2[0].xp - level_prec
								if (wizebot_xp_requis < 1000) {
									context.fillText( `/${wizebot_xp_requis}`, 1230, 765);
								} else {
									let wizebot_text_requis = rows[0].xp_requis / 100
									context.fillText( `/${wizebot_text_requis.toFixed(1)}k`, 1230, 765);
								}

								context.fillStyle = '#e9e9e9'; // Couleur Texte xp + stats
								context.font = '45px "rounded"'; // Police d'écriture nom
								context.fillText("Stats :", 235, 705);

								context.font = '30px "multipolar"'; // Police d'écriture nombres
								if (wizebot_xp < 1000) {
									context.fillText( `${wizebot_xp}`, 1230-Math.floor(context.measureText(`${wizebot_xp}`).width), 765);
								} else {
									let wizebot_text_xp = wizebot_xp / 1000
									context.fillText(`${wizebot_text_xp.toFixed(1)}k`, 1230-Math.floor(context.measureText(`${wizebot_text_xp.toFixed(1)}k`).width), 765);
								}
								context.fillText( `Niveau ${rows2[0].level}`, 1275-Math.floor(context.measureText(`Niveau ${rows2[0].level}`).width), 865);

								context.font = '25px "multipolar"'; // Police d'écriture nombres
								context.fillText( `•`, 70, 750);
								if (rows2[0].uptime > 3600) {
									Back2line(context,`${rows2[0].message} messages envoyés en ${Math.floor(rows2[0].uptime / 3600)}h ${Math.floor(rows2[0].uptime % 3600 / 60)}min et ${rows2[0].uptime % 60}s de visionnage.`, 90, 750, 460, 35);
								} else if (rows2[0].uptime > 60) {
									Back2line(context,`Tu as envoyé ${rows2[0].message} messages en ${Math.floor(rows2[0].uptime / 60)}min et ${rows2[0].uptime % 60}s.`, 90, 750, 460, 35);
								} else {
									Back2line(context,`Frérot... viens sur les streams non ?`, 90, 750, 460, 35);
								}

								context.fillText( `•`, 70, 830);
								if (rows2[0].follow) {
									if (!badges.includes('twitch_logo.png')) badges.push('twitch_logo.png');
									const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
									let number = new Date(parseInt(rows2[0].follow))
									Back2line(context,`Tu es follow à la chaine depuis le ${number.toLocaleDateString('fr-FR', options)} soit depuis ${Math.round((Date.now() -number) / (1000 * 60 * 60 * 24))} jours.`, 90, 830, 460, 35);
								} else {
									Back2line(context,`Il s'agirait de venir se follow...`, 90, 830, 460, 35);
								}
								 
								context.fillStyle = '#9046ff'; // Couleur barre d'xp twitch
								RoundRect(context, 610, 780, wizebot_xp * 680 / wizebot_xp_requis, 40, 20);

								
							}
							resolve();
						})
					} else {
						db.serialize(async() => {
							await db.run(`INSERT INTO profil (name, id) VALUES (?, ?)`,user.globalName, user.id);
							await db.run(`INSERT INTO xp (profil_id) VALUES (?)`,user.id);
	
							if (member) {
								if (!badges.includes('discord_logo.png')) badges.push('discord_logo.png');
					
								const roles = member.roles.cache.map(role => role.id);
					
								if (roles.includes('1064882468299227206') && !badges.includes('vip.png')) badges.push('vip.png');
								if (roles.includes('1064879470542082158') && !badges.includes('fonda.png')) badges.push('fonda.png');
								if (roles.includes('1279391680373723187') && !badges.includes('mod.png')) badges.push('mod.png');
								if (roles.includes('1056177696775884870') && !badges.includes('sub.png')) badges.push('sub.png');
							}
							if (user.accentColor && !user.banner) {
								const hexAccentColor = `#${user.accentColor.toString(16).padStart(6, '0')}`;
								context.save();
								context.fillStyle = hexAccentColor;
								context.rect(0, 0, 1360, 480);
								context.fill();
								context.restore();
							} else if (user.banner) {
								const bannier = await loadImage(`https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=1024`);
								context.drawImage(bannier, 0, 0, 1360, 480);
							} else {
								context.save();
								context.fillStyle = "#231620";
								context.rect(0, 0, 1360, 480);
								context.fill();
								context.restore();
							}
	
							context.fillStyle = '#290a10'
							context.shadowBlur = 25;
							RoundRect(context, 600, 600, 700, 60, 30);
							context.shadowBlur = 0;
							context.fillStyle = '#383c41';
							RoundRect(context, 610, 610, 680, 40, 20);
							context.font = '30px "multipolar"';
							context.fillText( `/100`, 1230, 595);
	
							context.fillStyle = '#e9e9e9';
							context.fillText( `0`, 1230-Math.floor(context.measureText(`0`).width), 595);
							context.fillText( `Niveau 0`, 1275-Math.floor(context.measureText(`Niveau 0`).width), 695);
							resolve();
						})
					}
				});
			});
		})

		db.close((err) => {
			if (err) {
				console.error(err.message);
			}
		});
		if (halloween.includes(user.id) && !badges.includes('pumpkin_1.png')) badges.push('pumpkin_1.png');
	
		context.fillStyle = '#290a10'
		context.shadowBlur = 50; // Intensité du flou de l'ombre
		context.save();
		context.beginPath();
		context.arc(225, 480, 163, 0, Math.PI * 2, true); 
		context.fill();
		context.restore();
		
		//Line between profil and banner
		context.save();
		context.beginPath()
		context.moveTo(0, 480)
		context.lineTo(1360, 480)
		context.closePath()
		context.stroke()
		context.restore();

		// Zone de badge

		context.shadowBlur = 50; 
		RoundRect(context, 725, 420, 540, 120, 60);
		context.shadowBlur = 0; 
		context.fillStyle = '#211216'	
		RoundRect(context, 735, 430, 520, 100, 50);

		
		const avatar = await loadImage(await (await fetch(user.displayAvatarURL({ format: 'jpg' }))).arrayBuffer())
		
		// Dessine l'arc de cercle pour faire un "clip"
		context.save();
		context.beginPath();
		context.arc(225/* Position de l'image*/ , 480/* Position de l'image*/, 150, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();
		context.drawImage(avatar, 75, 330, 300, 300);
		context.restore();


		// Affiche le profil
		context.fillStyle = '#e9e9e9';
		textZone(context, user.globalName, 405, 525, 310, 60, 40);
		context.fillStyle = '#c9c9c9';
		textZone(context, user.username, 385, 580, 330, 40, 20);

		context.shadowColor = 'transparent';
		context.shadowBlur = 0;
		
		context.fillStyle = '#290a10'
		context.save();
		context.beginPath();
		context.arc(619, 629, 34, 23, Math.PI * 2, true); 
		context.fill();
		context.restore();
		

		const discord = await loadImage('fichiers/img/discord.png');
  		context.drawImage(discord, 565, 588, 108, 82);

		if (!twitch) {
			context.save();
			context.beginPath();
			context.arc(619, 799, 34, 23, Math.PI * 2, true); 
			context.fill();
			context.restore();

			const twitchimg = await loadImage('fichiers/img/twitch.png');
  			context.drawImage(twitchimg, 590, 770, 57, 57);
		} else {
			context.strokeStyle = '#e60000'
			context.fillStyle = '#e60000'

			RoundRect(context, 100, 720, 1100, 200, 20, true);
			if (twitch == 'Aucune information trouvée pour ce compte --> /twitch') context.fillText(twitch, 140, 820, 1000);
			else context.fillText(twitch, 380, 820, 1000);
		}
		
		let i = 0
		for (const elm of badges) {
			i++
			if (i > 5) break
			let img = await loadImage(`fichiers/img/${elm}`);
			context.drawImage(img, badge, 440, 80, 80);
			badge += 90;
		}
		const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profil.png' });
		await interaction.editReply({ files: [attachment] });
	}
};
