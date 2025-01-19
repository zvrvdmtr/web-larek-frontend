
import {IOrderForm} from "../types";
import { IEvents } from "./base/events";
import { Form } from "./common/form";

export class Order extends Form<IOrderForm> {

    _card: HTMLInputElement
    _cash: HTMLInputElement
    _address: HTMLInputElement

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        const card = this.container.elements.namedItem('card') as HTMLInputElement
        const cash = this.container.elements.namedItem('cash') as HTMLInputElement

        card.addEventListener('click', () => {
            card.classList.add('button_alt-active')
            cash.classList.remove('button_alt-active')
            this.onInputChange('payment', 'card');
        })

        cash.addEventListener('click', () => {
            card.classList.remove('button_alt-active')
            cash.classList.add('button_alt-active')
            this.onInputChange('payment', 'cash');
        })
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}