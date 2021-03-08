import Client from './classes/Client';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new Client();
bot.build().then(async () => {
	bot.login(process.env.DISCORD_TOKEN);
});
