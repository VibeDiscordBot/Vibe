import Event from '../classes/Event';
import Logger from '../classes/Logger';

export default class extends Event {
	public name = 'Ready (client)';
	public type = 'ready';
	public once = true;

	public async run() {
		Logger.info(
			`${
				this.bot.shard ? `[shard ${this.bot.shard.ids[0]}]` : '[client]'
			} Is ready`
		);
	}
}
