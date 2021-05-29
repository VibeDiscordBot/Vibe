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

import Event from '../classes/Event';
import Logger from '../classes/Logger';
import WebServer from '../classes/website/WebServer';
//import wait from '../helpers/wait';

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

		new WebServer(this.bot)
			.listen(<number>(<any>process.env.WEBSERVER_PORT))
			.then((port) => {
				Logger.info(`Webserver online on port ${port}`);
			});

		// TODO Re-enable once reconnecting is less broken
		//await wait(5000);
		//this.bot.reconnectAll();
	}
}
