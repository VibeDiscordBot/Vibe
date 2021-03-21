import Event from '../classes/Event';
import Logger from '../classes/Logger';

export default class extends Event {
	public name = 'Shoukaku ready';
	public type = {
		type: 'ready',
		instance: 'shoukaku',
	};
	public once = true;

	public async run(nodeName: string) {
		Logger.info(`Shoukaku node [${nodeName}] is ready`);
	}
}
