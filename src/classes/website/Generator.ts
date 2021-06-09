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
import Command from '../Command';
import { Option, OptionType } from '../Interactions';
import fs from 'fs';
import path from 'path';
import { DJPermission } from '../../helpers/requestPermission';

export default class Generator {
	private get prefix() {
		return this.bot.cfg.prefix;
	}

	constructor(private bot: Client) {}

	private getComponent(name: string): string {
		return fs.readFileSync(
			path.join(__dirname, '..', '..', 'website', 'components', name),
			{
				encoding: 'utf-8',
			}
		);
	}

	private getPage(name: string): string {
		return fs.readFileSync(path.join(__dirname, '..', '..', 'website', name), {
			encoding: 'utf-8',
		});
	}

	private createCommandCard(command: Command) {
		return this.getComponent('commandCard.html')
			.replace('{prefix}', this.prefix)
			.replace('{name}', command.name)
			.replace('{description}', command.description)
			.replace(
				'{options}',
				command.options.length > 0
					? command.options
							.map((o) => (o = <any>this.optionToString(o)))
							.join('<br /><br />')
					: ''
			)
			.replace(
				'{alias}',
				command.alias.length > 0 ? 'Alias: ' + command.alias.join(', ') : ''
			)
			.replace(
				'{permissions}',
				command.permissions.length > 0
					? 'Permissions: ' +
							command.permissions
								.map(
									(p) =>
										(p = <any>isNaN(Number(p.toString()))
											? p.toString()
											: DJPermission[p])
								)
								.join(', ')
					: 'Permissions: Anyone'
			);
	}

	private optionToString(option: Option) {
		let type: String;
		if ((option.choices || []).length > 0) {
			const names = option.choices.map((c) => (c = <any>`"${c.name}"`));
			const last = names.pop();

			type = `${names.join(', ')} or ${last}`;
		} else {
			type = OptionType[option.type];
		}

		return `[${type}] ${option.name}${
			option.required
				? '<span style="color: red;" title="Required">*</span>'
				: ''
		}<br /><span> </span><span> </span>${option.description}`;
	}

	private generateCommandsSection() {
		const data: string[] = [];

		this.bot.commandHandler.commands.forEach((cmd) => {
			if (cmd.cmd.exclude) return;
			data.push(this.createCommandCard(cmd.cmd));
		});

		return data.join('\n');
	}

	private getTemplate(title: string) {
		return this.getComponent('empty.html')
			.replace('{head}', this.getComponent('head.html'))
			.replace('{title}', title)
			.replace(new RegExp('{sidebar}', 'g'), this.getComponent('sidebar.html'));
	}

	public generateCommandsPage() {
		return this.getTemplate('Vibe | Command overview').replace(
			'{content}',
			this.getPage('commands.html').replace(
				'{commandsSection}',
				this.generateCommandsSection()
			)
		);
	}

	public generateIndexPage() {
		return this.getTemplate('Vibe | The ultimate Discord music bot!').replace(
			'{content}',
			this.getPage('index.html')
		);
	}
}
