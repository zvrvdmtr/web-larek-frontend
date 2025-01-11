import { Api, ApiListResponse } from './base/api'
import { IProduct } from "../types";

export interface ILarekApi {
    getProducts(): Promise<IProduct[]>
    getProduct(id: string): Promise<IProduct>
    postOrder(order: object): Promise<object>
}

export class LarekApi extends Api implements ILarekApi {
    readonly cdn: string;

    constructor(baseUrl: string, cdnUrl: string) {
        super(baseUrl)
        this.cdn = cdnUrl
    }

    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        );
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get(`"/product/${id}"`).then((product: IProduct) => ({
            ...product,
            image: this.cdn + product.image,
        }))
    }

    postOrder(order: object): Promise<object> {
        return this.post("/order", order)
    }
}