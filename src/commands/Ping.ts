import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import Player from '../classes/Player';
import Queue from '../classes/Queue';

export default class Ping extends Command {
	public name = 'ping';
	public alias = ['pong'];
	public permissions = [];

	public async exec(message: Message, args: string[], label: string) {
		message.channel.send('Pong');

		const queue = new Queue()
		const player = new Player(this.bot, queue)
		queue.add({
			author: 'Evanesence',
			duration: 19239079130,
			name: 'Bring me to life',
			url: 'https://www.youtube.com/watch?v=3YxaaGgTQYM'
		})
		await player.connect(message.member.voice.channel)
		player.play()
	}
}
