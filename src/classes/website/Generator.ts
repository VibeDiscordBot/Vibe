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

	private createCommandCard(command: Command) {
		return `<div class="col-12 col-lg-6">
    <div class="card">
        <div class="cardExpandIconWrapper">
            <div class="cardExpandIcon">
                <img
                    width="100%"
                    height="100%"
                    src="img/expandArrow.png"
                    class="sidebarIconImg expandCard"
                />
            </div>
        </div>
        <div class="card-body">
            <h4 class="card-title cardText">${this.prefix}${command.name}</h4>
            <p class="card-text cardText marginBottom-0">
                ${command.description}
            </p>
            <div class="d-none row expandArea">
                <div class="col">
                    ${
											command.options.length > 0
												? `<p class="commandCardExpandText">${command.options
														.map((o) => (o = <any>this.optionToString(o)))
														.join('<br /><br />')}</p>`
												: ''
										}
                    ${
											command.alias.length > 0
												? `<p class="commandCardExpandText">Alias: ${command.alias.join(
														', '
												  )}</p>`
												: ''
										}
                    <p class="commandCardExpandText">
                        Permissions: ${
													command.permissions.length > 0
														? `${command.permissions
																.map(
																	(p) =>
																		(p = <any>isNaN(Number(p.toString()))
																			? p.toString()
																			: DJPermission[p])
																)
																.join(', ')}`
														: 'Anyone'
												}
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>`;
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

	public generateCommandsPage() {
		const template = fs.readFileSync(
			path.join(__dirname, '..', '..', 'website', 'commands.html'),
			{
				encoding: 'utf-8',
			}
		);

		const generated = template.replace(
			'{commandsSection}',
			this.generateCommandsSection()
		);

		return generated;
	}
}
