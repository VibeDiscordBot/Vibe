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

import Client from '../Client';
import express from 'express';
import http from 'http';
import path from 'path';
import ApiRouter from './ApiRouter';
import Generator from './Generator';
import fs from 'fs';
import cpf from 'copyfiles';

export default class WebServer {
	private app = express();
	private server = http.createServer(this.app);

	constructor(private client: Client) {
		this.app.use(
			express.static(path.join(__dirname, '..', '..', 'website', 'bin'))
		);
		this.app.use(
			'/css',
			express.static(path.join(__dirname, '..', '..', 'website', 'css'))
		);
		this.app.use(
			'/img',
			express.static(path.join(__dirname, '..', '..', 'website', 'img'))
		);
		this.app.use(
			'/js',
			express.static(path.join(__dirname, '..', '..', 'website', 'js'))
		);

		this.app.use('/api', new ApiRouter(client).router);
	}

	public listen(port: number): Promise<number> {
		return new Promise(async (res) => {
			await this.prepareBin();
			this.server.listen(port, () => {
				res(port);
			});
		});
	}

	private prepareBin(): Promise<void> {
		return new Promise((res) => {
			fs.mkdirSync(path.join(__dirname, '..', '..', 'website', 'bin'), {
				recursive: true,
			});
			cpf(
				[
					path.join(__dirname, '..', '..', 'website', '*.html'),
					path.join(__dirname, '..', '..', 'website', 'bin'),
				],
				{
					up: path
						.resolve(path.join(__dirname, '..', '..', 'website'))
						.split('/').length,
				},
				() => {
					this.generateFiles();
					res();
				}
			);
		});
	}

	private generateFiles() {
		fs.writeFileSync(
			path.join(__dirname, '..', '..', 'website', 'bin', 'commands.html'),
			new Generator(this.client).generateCommandsPage()
		);
	}
}
