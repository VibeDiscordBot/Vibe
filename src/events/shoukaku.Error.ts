import { ShoukakuError } from 'shoukaku';
import Event from '../classes/Event';
import Logger from '../classes/Logger';

export default class extends Event {
	public name = 'Shoukaku error';
	public type = {
		type: 'error',
		instance: 'shoukaku',
	};
	public once = false;

	public async run(nodeName: string, error: ShoukakuError) {
		Logger.info(`Shoukaku node [${nodeName}] error: ${error}`);
	}
}
