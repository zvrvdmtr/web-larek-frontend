type Type = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
type Payment = 'При получении' | 'Онлайн';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IProduct {
	id: string;
	title: string;
	description: string;
	price: number | null;
	category: string;
	type: Type;
	image: string;
}

export interface IOrder {
	address: string;
	email: string;
	phone: string;
	payment: string;
}

export interface IOrderForm {
	address: string;
	payment: string;
}

export interface IContactForm {
	email: string;
	phone: string;
}

export interface ICart {
	products: IProduct[];
}

export interface IApplication {
	products: IProduct[];
	cart: string[];

	addToCart(product: IProduct): void;

	removeFromCart(product: IProduct): void;

	getCart(): ICart;

	placeOrder(): void;

	submitOrderForm(field: keyof IOrderForm, value: string): void;

	validateOrderForm(): `void`;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
}

export interface ISuccessForm {
	description: string;
}
