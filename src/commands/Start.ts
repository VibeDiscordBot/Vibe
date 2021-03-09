import Command from '../classes/Command';
import { Message } from 'discord.js-light';

export default class Example extends Command {
	public name = 'start';
	public alias = ['s'];
	public permissions = [];

	public async exec(message: Message, args: string[], label: string) {
		const player = this.bot.guildManager.getPlayer(message.guild);

		await player.connect(message.member.voice.channel);
		player.play();
	}
}
