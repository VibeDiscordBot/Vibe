import Handler from '../classes/Handler';
import * as path from 'path';
import * as fs from 'fs';
import Event from '../classes/Event';
import Logger from '../classes/Logger';

// noinspection ES6MissingAwait
export default class EventHandler extends Handler {
	public name = 'Eventhandler';

	public async init() {
		const eventsPath = this.bot.cfg.path.events;

		fs.readdirSync(eventsPath, {
			withFileTypes: true,
		}).forEach(async (event) => {
			if (event.isFile() && event.name.endsWith('.ts')) {
				const C = (await import(path.join(eventsPath, event.name))).default;
				const instance: Event = new C(this.bot);

				if (typeof instance.type === 'string') {
					this.bot[instance.once ? 'once' : 'on'](
						instance.type,
						(...args: any[]) => {
							instance.exec(...args);
						}
					);
					Logger.info(
						`Registered event (type: ${
							instance.once ? 'once' : 'on'
						}) (instance: discord) ${instance.name}`
					);
				} else {
					switch (instance.type.instance) {
						case 'discord':
							this.bot[instance.once ? 'once' : 'on'](
								instance.type.name,
								(...args: any[]) => {
									instance.exec(...args);
								}
							);
							break;
						case 'mongoose':
							this.bot.db.connection[instance.once ? 'once' : 'on'](
								instance.type.name,
								(...args: any[]) => {
									instance.exec(...args);
								}
							);
							break;
						case 'shoukaku':
							this.bot.shoukaku[instance.once ? 'once' : 'on'](
								<any>instance.type.name,
								(...args: any[]) => {
									instance.exec(...args);
								}
							);
							break;
					}

					Logger.info(
						`Registered event (type: ${
							instance.once ? 'once' : 'on'
						}) (instance: ${instance.type.instance}) ${instance.name}`
					);
				}
			}
		});
	}
}
