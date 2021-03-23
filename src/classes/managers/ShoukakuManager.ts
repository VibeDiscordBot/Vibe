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
