const { Listener } = require('discord-akairo');
const Discord = require('discord.js')
const randColor =  require('../funcs.js')
const channels = require('../serverData.json');
class GuildMemberRemoveListener extends Listener {
    constructor() {
        super('GuildMemberRemove', {
            emitter: 'client',
            event: 'GuildMemberRemove'
        });
    }
    
async exec(member) {
    let channel = channels[member.guild.id].leave
    channel = this.client.channels.cache.get(channel)
    let embed = new Discord.MessageEmbed()
	    .setTitle(`${member.user.username} Left!`)
	    .addField('Account age', member.user.createdAt.toDateString(),true)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
	    .setFooter(`You're now left with ${member.guild.members.cache.size - 1} members.`)
	    .setColor(0xaa00cc)
        try {
            await channel.send(embed)
        }
        catch(e) {
            console.log(e)
            return;
        }
    }
} 

console.log('Guild member remove handler ready!')
module.exports = GuildMemberRemoveListener;