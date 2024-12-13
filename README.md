# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание данных

Тип описывает типы товаров
```
type ProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'
```

Тип описывает способы оплаты
```
type Payment = 'При получении' | 'Онлайн'
```

Тип описывает ошибки формы
```
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

Тип описывает генерируемые события
```
type EventName = string
```

Интерфейс описывает товар
```
export interface IProduct {
    id: string
    title: string
    description: string
    price: number
    category: ProductCategory
    img: string
}
```

Интерфейс описывает форму заказа
```
export interface IOrder {
    address: string
    email: number
    phone: string
    payment_method: Payment
    products: IProduct[]
}
```

Интерфейс описывает корзину
```
export interface ICart {
    products: IProduct[]
}
```

Интерфейс описывает приложения.
```
export interface IApplication {
    products: IProduct[]
    cart: string[]

    addToCart(product: IProduct): void
    removeFromCart(product: IProduct): void
    getCart(): ICart
    resetCart(): void
    submitOrderForm(field: keyof IOrderForm, value: string): void
    validateOrderForm(): `void`
}
```

Интерфейс описывает брокер событий
```
export interface IEvents {
    # установить обработчик на событие
    on(eventName: EventName, callback: function)
    # запустить обработчики для события
    emit(eventName: EventName)
}
```

## Слой Model

### EventEmitter
Класс описывает брокер событий
```
export class EventEmitter implements IEvents {
    # установить обработчик на событие
    on(eventName: EventName, callback: function)
    # запустить обработчики для события
    emit(eventName: string)
}
```
#### Как работает EventEmitter.
Класс нужен для связывание событий с неким действием, которое представлено callback-функцией
1. Сохраняем название события и связанное с ним действие в объект типа map - event:callback через вызов метода on
2. Генерируем событие где-то в коде приложения, например, кликаем на иконку корзину
3. Отправляем информацию о событии `basket:open` в брокер событий через метод emit
4. Находит в map связанный с этим событие callback и вызывает его

### Api
Класс описывает методы http-клиента
```
export class Api {
    # GET запрос
    get(url: string)
    # POST запрос
    post(url: string, body: object)
}
```

### Application
Класс описывает приложение и действия с ним
```
export class Application implements IApplication {
    # список товаров
    products: IProduct[]
    # список товаров в корзине
    cart: string[]

    # добавление товара в корзину
    addToCart(product: IProduct): void
    # удаление товара из корзины
    removeFromCart(product: IProduct): void
    # получаем корзину и список товаров в ней
    getCart(): ICart
    # сброс данных корзины, например, после оформления заказа покупки
    resetCart(): void
    # создание нового заказа с заполненными полями
    submitOrderForm(field: keyof IOrderForm, value: string): void
    # валидация введенных данных для заказа
    validateOrderForm(): `void`
}
```

### LarekApi
Класс описывает взаимодействие с API
```
export class LarekApi extends Api {
    # получаем список товаров, для отображения на главной странице
    getProducts(): []object
    # получаем конкретны товар по ID
    getProduct(id: string): object
    # отправляем на сервер объект заказа (данные введенные пользователем и список товаров)
    postOrder(order: object)
}
```

## Слой View

### Component
Класс описывает базовый компонент и предоставляет базовый набор методов для работы с HTML элементами.
Данный класс абстрактный, от него наследуются классы представления.
```
abstract class Component {
    # Переключает класс
    toggleClass()
    # Устанавливает текст элементу
    setText()
    # Скрывает элемент
    setHidden()
    # Открывает элемент
    setVisible()
    # Устанавливает изображение элементу
    setImage()
    # Рендерит корнейвой DOM-элемент
    render()
}
```

### Form
Класс описывает базовый компонент для работы с формами.
```
class Form extends Component {
    # Установить состояние валидности формы
    setValid()
    # Отобразить сообщение об ошибки
    setErrors()
}
```

### Page
Класс Page отвечает за отображение главной страницы
```
class Page extends Component {
    # Количество товаров в корзине
    basketCounter: string
    # Список отображаемых товаров на странице
    products: string
}
```

### Card
Класс Card отвечает за отображение карточки товара
```
class Card extends Component {
    # Название товара
    title: string;
    # Описание товара
    description: string;
    # URL адрес изображение товара
    image: string;
    # Цена товара
    price: number;
    # Категория товара
    category: ProductCategory;

    # Устанавливает название товара
    setTitle()
    # Устанавливает описание товара
    setDescription()
    # Устанавливает изображение товара
    setImage()
    # Устанавливает цену на товар
    setPrice()
    # Проверяет, что цена не равна 0
    isForSell()
}
```

### Basket
Класс Basket отвечает за отображение корзины
```
class Basket extends Component {
    # Список товаров в корзине
    products: []IProduct

    # Отображает сумму всех товаров в корзины
    renderTotalAmount()
}
```

### Order
Класс Order отвечает за отображение заказа
```
class Order extends Form {
    # Устанавливает тип оплаты
    setPayment()
    # Устанавливает значение адреса в поле формы
    setAddress()
}
```

### Contacts
Класс Contacts отвечает за форму ввода контактной информации
```
class Contacts extends Form {
    # Устанавливает значение номера телефона в поле формы
    setPhone()
    # Устанавливает значение почты в поле формы
    setEmail()
}
```

### Success
Класс Success отвечает за отображение успешного заказа
```
class Success extends Component {
    # Отобразить ID заказа
    setId()
    # Устанавливает общую сумму заказа
    setAmount()
}
```

### Modal
Класс Modal отвечает за отображение модальных окон
```
class Modal extends Component {
    # Открыть модальное окно
    open() 
    # Закрыть модальное окно
    close() 
}
```

### Слой Presenter
Код слоя Presenter не будет выделен в отдельный класс, а будет размещен в основном скрипте приложения в index.ts.


### Генерируемые события
`items:changed` - Событие вызывается при изменении списка товаров. Перерисовывает список товаров на странице.
`card:select` - Событие вызывается при клике на карточку товара. Открывается модальное окно в котором отображается выбранная карточка
`basket:open` - Событие вызывается при клике на иконку корзины. Открывается модальное окно в котором отображаются товары добавленные в корзину.
`basket:change` - Событие вызывается при добавлении или удалении товара из корзины. Изменяется счетчик товаров и общая сумма заказа.
`order:open` - Событие вызывается при нажатии кнопки "оформить" в модальном окне корзины. В модальном окне отображается форма ввода данных заказа.
`order:submit` - Событие вызывается при заполнении данных на форме заказа и нажатии кнопки "далее". Данные валидируюся. В модальном окне отображается форма ввода контактной информации.
`contacts:submit` - Событие вызывается при заполнении контактов на форме ввода контактов и нажатии кнопки "оплатить". Данные валидируюся. Создается заказ и отправляется на сервер. 
`order:success` - Событие вызывается при успешном ответе сервера после оплаты товара. В модальном окне отображается информация о завершении заказа.
`formErrors:change ` - Событие вызывается в случае если в процессе валидации данных формы были обнаружены ошибки.
`modal:close` - Событие вызывается при закрытии модального окна. Закрывает модальное окно.
