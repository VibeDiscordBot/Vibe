import { Shoukaku } from 'shoukaku';
import Client from '../Client';

export default class ShoukakuManager extends Shoukaku {
	constructor(bot: Client) {
		super(
			bot,
			[
				{
					name: 'main',
					auth: 'weeb=gura=yse',
					host: 'localhost',
					port: 6969,
				},
			],
			{}
		);
	}
}
