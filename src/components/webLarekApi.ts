import { IOrder, IOrderResult, IProductList } from "../types";
import { Api } from "./base/api";

export interface IWebLarekApi {
    getProducts(): Promise<IProductList>;
    createOrder(order: IOrder): Promise<IOrderResult>;
}

export class WebLarekApi extends Api implements IWebLarekApi {
    readonly cdn: string

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
    getProducts(): Promise<IProductList> {
        return this.get('/product') as Promise<IProductList>;
    }

    createOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order) as Promise<IOrderResult>;
    }
}