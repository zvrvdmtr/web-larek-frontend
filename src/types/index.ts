type Type = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'
type Payment = 'При получении' | 'Онлайн'

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IProduct {
    id: string
    title: string
    description: string
    price: number | null
    type: Type
    image: string
}

export interface IOrder {
    address: string
    email: number
    phone: string
    payment_method: Payment
    products: IProduct[]
}

export interface IOrderForm {
    address: string
    email: number
    phone: string
    payment_method: Payment
}

export interface ICart {
    products: IProduct[]
}

export interface IApplication {
    products: IProduct[]
    cart: string[]

    addToCart(product: IProduct): void

    removeFromCart(product: IProduct): void

    getCart(): ICart

    placeOrder(): void

    submitOrderForm(field: keyof IOrderForm, value: string): void

    validateOrderForm(): `void`
}
