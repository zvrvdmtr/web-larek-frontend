import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
	_title: HTMLElement;
	_description: HTMLElement;
	_image: HTMLImageElement;
	_price: HTMLElement;
	_category: HTMLElement;
	_button: HTMLButtonElement;

	_color : { [key: string]: string } = {
		'софт-скил': 'soft',
		'другое': 'other',
		'дополнительное': 'additional',
		'кнопка': 'button',
		'хард-скил': 'hard',
	};


	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);

		this._category = container.querySelector(`.card__category`);
		this._image = container.querySelector(`.card__image`);
		this._description = container.querySelector(`.card__text`);
		this._button = container.querySelector(`.card__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	get title(): string {
		return this._title.textContent;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get price(): string {
		return this._price.textContent;
	}

	set price(value: string) {
		if (!value) {
			this.setText(this._price, `Бесценно`);
			return;
		}
		this.setText(this._price, `${value} синапсов`);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: string) {
		const color = this._color[value]
		this._category.className = `card__category card__category_${color}`;
		this.setText(this._category, value);
	}
}
