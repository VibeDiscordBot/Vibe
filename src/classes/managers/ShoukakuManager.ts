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

import { Shoukaku } from 'shoukaku';
import Client from '../Client';

export default class ShoukakuManager extends Shoukaku {
	constructor(bot: Client) {
		super(
			bot,
			[
				{
					name: 'main',
					auth: process.env.LAVALINK_AUTH,
					host: process.env.LAVALINK_HOST,
					port: <any>process.env.LAVALINK_PORT,
				},
			],
			{
				moveOnDisconnect: false,
				resumable: false,
				resumableTimeout: 30,
				reconnectTries: 2,
				restTimeout: 10000,
			}
		);

		this.on('error', (node, error) => {
			console.log(error);
		});
	}
}
