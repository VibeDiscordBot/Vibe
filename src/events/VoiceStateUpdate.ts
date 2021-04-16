import { VoiceState } from 'discord.js-light';
import Event from '../classes/Event';

export default class extends Event {
	public name = 'VoiceStateUpdate (Player channel)';
	public type = 'voiceStateUpdate';
	public once = false;

	public async run(oldState: VoiceState, newState: VoiceState) {
		if (newState) return; // Someone connected or updated (not disconnected)
		if (oldState.member.id === this.bot.user.id) return; // Ignore events originated from the bot
		const player = await this.bot.guildManager.getPlayer(oldState.guild);
		if (player.channel.id === oldState.channel.id) {
			player.update();
		}
	}
}
