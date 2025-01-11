import { ISuccessForm } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ISuccessActions {
	onClick: (event: MouseEvent) => void;
}

export class Success extends Component<ISuccessForm> {
	_button: HTMLButtonElement;
	_description: HTMLElement;

	constructor(container: HTMLFormElement, actions?: ISuccessActions) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);
		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	set description(value: string) {
		this._description.textContent = `Списано ${value} синапсов`;
	}
}
