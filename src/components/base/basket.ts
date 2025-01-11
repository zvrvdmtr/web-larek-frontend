import {Component} from "../base/Component";
import {createElement, ensureElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";

interface IBasket {
    items: HTMLElement[];
    price: number;
}

interface ICardBasket {
	onClick: (event: MouseEvent) => void;
}

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Basket extends Component<IBasket> {
    _list: HTMLElement;
    _price: HTMLElement;
    _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._price = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set price(price: number) {
        this.setText(this._price, price);
    }
}

interface ICardBasket {
    price: number;
    title: string;
}

export class CardBasket extends Component<ICardBasket> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container)
        this._price = ensureElement<HTMLElement>(`.card__price`, container)
        this._button = ensureElement<HTMLElement>(`.card__button`, container)

        if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
    }
    
    set title(value: string) {
        this.setText(this._title, value)
    }

    set price(value: string) {
        this.setText(this._price, value)
    }
}