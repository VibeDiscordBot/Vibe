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

import {
	DMChannel,
	Message,
	MessageEmbed,
	MessageReaction,
	NewsChannel,
	TextChannel,
	User,
} from 'discord.js';

type AnyTextChannel = TextChannel | NewsChannel | DMChannel;

export default class PagedEmbed {
	private channel: AnyTextChannel;
	private pages: MessageEmbed[];
	private page = 0;
	private message: Message = null;
	private owner: User;
	private originalFooter: {
		[index: number]: string;
	} = {};
	private pageFooter: boolean;

	private get currentPage() {
		return this.pages[this.page];
	}

	private constructor(
		channel: AnyTextChannel,
		owner: User,
		pageFooter: boolean,
		...pages: MessageEmbed[]
	) {
		this.channel = channel;
		this.owner = owner;
		this.pages = pages;
		this.pageFooter = pageFooter;
	}

	private constructPage() {
		if (this.pageFooter) {
			if (!this.originalFooter[this.page]) {
				this.originalFooter[this.page] = this.currentPage.footer.text || '';
			}

			return this.currentPage.setFooter(
				(this.originalFooter[this.page] && this.originalFooter[this.page] !== ''
					? `${this.originalFooter[this.page]} | `
					: '') + `Page ${this.page + 1} of ${this.pages.length}`,
				this.currentPage.footer.iconURL
			);
		} else return this.currentPage;
	}

	private async send() {
		if (this.message) {
			this.message = await this.message.edit(this.constructPage());
		} else {
			this.message = await this.channel.send(this.constructPage());
		}

		const left = '⬅️';
		const right = '➡️';

		await this.message.react(left);
		await this.message.react(right);

		const collector = this.message.createReactionCollector(
			(reaction: MessageReaction, user: User) =>
				(reaction.emoji.name === left || reaction.emoji.name === right) &&
				user.id === this.owner.id,
			{
				idle: 30 * 1000,
				dispose: true,
			}
		);

		const update = (name: string) => {
			if (name === left) {
				this.page = this.page - 1 >= 0 ? this.page - 1 : this.pages.length - 1;
			} else if (name === right) {
				this.page = this.page + 1 < this.pages.length ? this.page + 1 : 0;
			}

			this.message.edit(this.constructPage());
		};

		collector.on('collect', (reaction) => {
			update(reaction.emoji.name);
		});

		collector.on('remove', (reaction) => {
			update(reaction.emoji.name);
		});
	}

	public static async create(
		channel: AnyTextChannel,
		owner: User,
		pageFooter: boolean,
		...pages: MessageEmbed[]
	): Promise<PagedEmbed> {
		const self = new PagedEmbed(channel, owner, pageFooter, ...pages);

		await self.send();

		return self;
	}

	public static async createAsEdit(
		message: Message,
		owner: User,
		pageFooter: boolean,
		...pages: MessageEmbed[]
	): Promise<PagedEmbed> {
		const self = new PagedEmbed(message.channel, owner, pageFooter, ...pages);

		self.message = message;
		await self.send();

		return self;
	}

	private static splitIntoPages(
		text: string,
		base: MessageEmbed
	): MessageEmbed[] {
		const pages: MessageEmbed[] = [];

		const lines = text.split('\n');
		const textPerPage = 2000 - JSON.stringify(base.toJSON()).length;
		let cycleText = '';
		lines.forEach((line) => {
			if (cycleText.length + line.length < textPerPage) {
				// Not belowOrEqual in order to compensate for newLine
				cycleText += '\n';
				cycleText += line;
			} else {
				pages.push(new MessageEmbed(base.toJSON()).setDescription(cycleText));
				cycleText = '';
			}
		});
		if (cycleText !== '') {
			pages.push(new MessageEmbed(base.toJSON()).setDescription(cycleText));
		}

		return pages;
	}

	public static async createFromDescription(
		channel: AnyTextChannel,
		owner: User,
		pageFooter: boolean,
		description: string,
		base: MessageEmbed
	): Promise<PagedEmbed> {
		return await this.create(
			channel,
			owner,
			pageFooter,
			...this.splitIntoPages(description, base)
		);
	}

	public static async createAsEditFromDescription(
		message: Message,
		owner: User,
		pageFooter: boolean,
		description: string,
		base: MessageEmbed
	): Promise<PagedEmbed> {
		return await this.createAsEdit(
			message,
			owner,
			pageFooter,
			...this.splitIntoPages(description, base)
		);
	}
}
