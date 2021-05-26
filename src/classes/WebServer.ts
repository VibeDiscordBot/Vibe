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

import Client from './Client';
import express from 'express';
import http from 'http';
import path from 'path';

export default class WebServer {
	private app = express();
	private api = express.Router();
	private server = http.createServer(this.app);

	constructor(private client: Client) {
		this.app.use(express.static(path.join(__dirname, '..', 'website')));
		this.app.use('/api', this.api);
	}

	public listen(port: number): Promise<number> {
		return new Promise((res) => {
			this.server.listen(port, () => {
				res(port);
			});
		});
	}
}
