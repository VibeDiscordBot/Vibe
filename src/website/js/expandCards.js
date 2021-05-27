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

/* eslint-disable no-undef */

/**
 * @param {HTMLElement} expandCard
 */
function findExpandArea(expandCard) {
	const cardChildren =
		expandCard.parentElement.parentElement.parentElement.children;

	/**
	 * @type {HTMLElement}
	 */
	let cardBody;
	for (let i = 0; i < cardChildren.length; i++) {
		const child = cardChildren[i];

		if (child.classList.contains('card-body')) {
			cardBody = child;
			break;
		}
	}

	/**
	 * @type {HTMLElement}
	 */
	let expandArea;
	for (let i = 0; i < cardBody.children.length; i++) {
		const child = cardBody.children[i];

		if (child.classList.contains('expandArea')) {
			expandArea = child;
			break;
		}
	}

	return expandArea;
}

const expandCards = document.getElementsByClassName('expandCard');
for (let i = 0; i < expandCards.length; i++) {
	const expandCard = expandCards[i];
	const expandArea = findExpandArea(expandCard);

	expandCard.addEventListener('click', () => {
		expandArea.classList.toggle('d-none');
		expandArea.previousElementSibling.classList.toggle('marginBottom-0');
	});
}
