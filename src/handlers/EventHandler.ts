/*
    Copyright (C) 2021 Tijn Hoftijzer

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
							this.bot.db._.connection[instance.once ? 'once' : 'on'](
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
