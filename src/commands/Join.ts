import Command from '../classes/Command';
import { Message, MessageEmbed, PermissionString } from 'discord.js-light';

export default class Join extends Command {
	public name = 'join';
	public alias = ['j'];
	public permissions: PermissionString[] = [
		'CONNECT',
		'SPEAK'
	];

	public async exec(message: Message, args: string[], label: string) {
		if(message.member.voice?.channel) {
			const player = await this.bot.guildManager.getPlayer(message.guild);

			await player.connect(message.member.voice.channel);
			message.channel.send(new MessageEmbed()
										.setTitle(`Joined ${player.channel.name}`))
		}else {
			message.channel.send(new MessageEmbed()
									.setTitle('You need to be in a voice channel to do that'))
		}
	}
}
