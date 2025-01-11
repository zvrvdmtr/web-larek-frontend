import { FormErrors, IOrder, IProduct } from "../../types"
import { IEvents } from "../base/events"


export class Application {
    catalog: IProduct[]
    basket: IProduct[]
    order: IOrder = {
        email: "",
        phone: "",
        address: "",
        payment: "",
    }

    formErrors: FormErrors = {};

    constructor(protected events: IEvents) {
        this.basket = []
    }

    setCatalog(products: IProduct[]) {
        this.catalog = products
        this.events.emit("items:changed", {products: this.catalog})
    }
    
    addToBasket(item: IProduct): void {
        this.basket.push(item)
    }

    removeFromBasket(item: IProduct): void {
        this.basket = this.basket.filter((product) => product.id != item.id)
    }

    getTotalBasketPrice(): number {
        return this.basket.reduce((acc, product) => acc + product.price, 0) ;
    }

    setOrderField(field: keyof IOrder, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    setContactsField(field: keyof IOrder, value: string) {
        this.order[field] = value;

        if (this.validateContacts()) {
            this.events.emit('contacts:ready', this.order);
        }
    }

    cleanBasket() {
        this.basket = []
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать тип оплаты';
        }
        this.formErrors = errors;
        this.events.emit('orderFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        this.formErrors = errors;
        this.events.emit('contactFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

}