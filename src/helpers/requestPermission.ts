import { GuildMember, TextChannel, User } from 'discord.js-light';
import Client from '../classes/Client';
import { PlayerStatus, simplifyPlayerStatus } from '../classes/Player';
import { getNotification } from './embed';

export enum DJPermission {
	dj,
	vote,
	alone,
	any,
}

export enum PermissionReason {
	none,
	notConnected,
	isDj,
	isAlone,
	vote,
	connected,
}

export async function requestPermission(
	bot: Client,
	channel: TextChannel,
	user: GuildMember,
	permissions: DJPermission[]
): Promise<{
	perm: boolean;
	reason: PermissionReason;
}> {
	if (permissions.length < 1)
		return {
			perm: true,
			reason: PermissionReason.none,
		};

	const player = await bot.guildManager.getPlayer(channel.guild);
	const isConnected =
		simplifyPlayerStatus(player.status) === PlayerStatus.Connected
			? player.channel.members.find((m) => m.id === user.id)
			: false;

	if (permissions.includes(DJPermission.any) && isConnected)
		return {
			perm: true,
			reason: PermissionReason.connected,
		};

	const roleIds: string[] = (<any>await user.fetch())._roles;
	let isDj = false;
	for (let i = 0; i < roleIds.length; i++) {
		const role = await user.guild.roles.fetch(roleIds[i]);
		if (role.name.toLowerCase() === 'dj') {
			isDj = true;
			break;
		} else continue;
	}
	if (permissions.includes(DJPermission.dj) && isDj)
		return {
			perm: true,
			reason: PermissionReason.isDj,
		};

	if (simplifyPlayerStatus(player.status) === PlayerStatus.Connected) {
		if (!isConnected)
			return {
				perm: false,
				reason: PermissionReason.notConnected,
			};
	}

	if (permissions.includes(DJPermission.alone)) {
		if (simplifyPlayerStatus(player.status) === PlayerStatus.Connected) {
			if (player.channel.members.size < 3)
				return {
					perm: true,
					reason: PermissionReason.isAlone,
				};
		}
	}

	if (permissions.includes(DJPermission.vote)) {
		return {
			perm: true,
			reason: PermissionReason.vote,
		};
	}

	return {
		perm: false,
		reason: PermissionReason.none,
	};
}

export function getMessage(
	perm: boolean,
	reason: PermissionReason,
	author: User
) {
	if (reason === PermissionReason.notConnected) {
		return getNotification('You are not connected to my voice channel', author);
	} else if (reason === PermissionReason.none) {
		return getNotification(
			perm ? 'You are allowed to do this' : 'You are not allowed to do this',
			author
		);
	}
}
