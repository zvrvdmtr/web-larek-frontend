import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Page } from './components/base/Page';
import { Card } from './components/base/Card';
import { Modal } from './components/common/modal';
import { LarekApi } from './components/LarekAPI';
import { Application } from './components/models/Application';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrderForm, IProduct, IContactForm } from './types';
import { Basket, CardBasket } from './components/base/basket';
import { Order } from './components/order';
import { Contacts } from './components/contacts';
import { Success } from './components/success';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new LarekApi(API_URL, CDN_URL);
const events = new EventEmitter();
const application = new Application(events);
const page = new Page(document.body, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

events.on('items:changed', () => {
	page.catalog = application.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => {
				events.emit('card:select', item);
			},
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
			description: item.description,
		});
	});
	page.render();
});

events.on('card:select', (item: IProduct) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:add', item);
		},
	});
	const isInBasket = application.basket.some((product) => {
		return product.id === item.id;
	});
	if (isInBasket) {
		card._button.disabled = true;
		card._button.textContent = 'Добавлен в корзину';
	}
	if (item.price === null) {
		card._button.disabled = true;
		card._button.textContent = 'Нельзя купить';
	}
	modal.render({ content: card.render(item) });
	modal.open();
});

events.on('card:add', (item: IProduct) => {
	application.addToBasket(item);
	page.basketCounter = application.basket.length;
	modal.close();
});

events.on('card:delete', (item: IProduct) => {
	application.removeFromBasket(item);
	page.basketCounter = application.basket.length;
	basket.price = application.getTotalBasketPrice();
	basket.items = application.basket.map((item) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('card:delete', item);
			},
		});
		return card.render({
			title: item.title,
			price: item.price,
		});
	});

	if (!application.basket.length) {
		basket._button.disabled = true;
	}

	modal.render({ content: basket.render() });
});

events.on('basket:open', () => {
	basket.price = application.getTotalBasketPrice();
	basket.items = application.basket.map((item, index) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('card:delete', item);
			},
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index+1,
		});
	});

	if (!application.basket.length) {
		basket._button.disabled = true;
	}

	modal.render({ content: basket.render() });
});

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contactFormErrors:change', (errors: Partial<IContactForm>) => {
	const { phone, email } = errors;
	contacts.valid = !phone && !email;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		application.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactForm; value: string }) => {
		application.setContactsField(data.field, data.value);
	}
);

events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	api
		.postOrder({
			payment: application.order.payment,
			address: application.order.address,
			email: application.order.email,
			phone: application.order.phone,
			total: application.getTotalBasketPrice(),
			items: application.basket.map((product) => product.id),
		})
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: success.render({
					description: application.getTotalBasketPrice().toString(),
				}),
			});
			application.cleanBasket();
			application.cleanOrder();
			page.basketCounter = 0;
		})
		.catch((err) => {
			console.log(err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getProducts()
	.then((result) => {
		application.setCatalog(result);
	})
	.catch((err) => {
		console.log(err);
	});
