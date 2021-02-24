const { Command } = require("discord-akairo");
const { randColor } = require("../funcs.js");
const Discord = require("discord.js");
class MuteCommand extends Command {
	constructor() {
		super('mute', {
			aliases: ['mute'],
			category: 'moderation',
			description: 'Mute a user',
			channel: 'guild',
			userPermissions: [
				'MUTE_MEMBERS',
				'MANAGE_MESSAGES'
			],
			clientPermissions: 'MANAGE_ROLES',
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: 'Who would you like to mute?',
						retry: 'Invalid user, Who would you like to mute?',
						ended: 'Too many retries!',
						cancel: 'Cancelled the command',
						timeout: 'Ran out of time'
					}
				},
				{
					id: 'time',
					type: 'number',
					prompt: {
						start: 'How long would you like to mute for?',
						retry: 'Invalid time input, How long would you like to mute for?',
						ended: 'Too many retries',
						timeout: 'Ran out of time'
					}
				},
				{
					id: 'message',
					type: 'string',
					match: 'rest',
					prompt: {
						start: 'What\'s the reason for this mute?'
					}
				}
			]
		})
	}

	async exec(message, args, error) {
		let argsMute = args.member
		let argsTime = args.time
		argsTime = Number(argsTime)*1000*60;
		let argsReason = args.message
		let muteRole = message.guild.roles.cache.find(e => e.name.toLowerCase() == "muted");
		if (!muteRole){
			try{
				muteRole = await message.guild.create.role({
					name: "Muted",
					color: "#000000",
					permissions:[]
				})
				message.guild.channels.forEach(async (channel, id) => {
					await channel.overwritePermissions(muteRole, {
						SEND_MESSAGES: false,
						ADD_REACTIONS: false
					});
				});
			}
			catch(error) {
				message.util.send('Couldn\'t mute.')
			}
		}

		if (message.member.roles.cache.has(muteRole)) return message.reply('Has already been muted')
		if (argsMute.id == argsMute.bot) return message.util.reply('You can\'t mute bots!')
		if (argsMute.id == message.author.id) return message.util.send('You can\'t mute yourself');
		await message.member.roles.add(muteRole)
			let embed6 = new Discord.MessageEmbed()
				.setTitle('Muting')
				.setDescription(`<@${argsMute.id}> has been muted for ${argsTime} minutes, reason: \`${argsReason}\`.`)
				.setColor(0xaa00cc)
			await message.channel.send(embed6);
			let embed7 = new Discord.MessageEmbed()
				.setTitle('Mute report.')
				.setDescription(`You got muted! Watch it next time!\nListed below are details.`)
				.addField(`Server`, `${message.guild.name}`, true)
				.addField(`time`, `${argsTime} minutes`, true)
				.addField(`You got muted by`, `<@${message.author.id}>`, true)
				.addField(`Reason`, `${argsReason}`, true)
				//.addField(`Mute count`, ``, true)
				.setColor(0xaa00cc)
			await message.client.users.cache.get(argsMute.id).send(embed7);
		setTimeout(async function(){
			argsMute.roles.remove(muteRole)
			let embed8 = new Discord.MessageEmbed()
				.setTitle('Muting')
				.setDescription(`<@${argsMute.id}> has been unmuted!`)
				.setColor(0xaa00cc)
			await message.author.send(embed8);
		}, argsTime);
	}
};

module.exports = MuteCommand;