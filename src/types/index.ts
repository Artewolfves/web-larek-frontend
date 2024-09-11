export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: CategoryProduct;
    price: number | null;
}

export enum CategoryProduct {
    'софт-скил' = 'soft',
    'другое' = 'other',
    'хард-скил' = 'hard',
    'дополнительное' = 'additional',
    'кнопка' = 'button'
}

export interface IProductList {
    items: IProductItem[];
    total: number;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export type FormErrors = {
    email?: string;
    phone?: string;
    address?: string;
    payment?: string;
};

export type TBasketProduct = Pick<IProductItem, "id" | "title" | "price">

export type ListItem = {
    index: number;
}

export interface IOrderResult {
    id: string;
    total: number;
    error?: string;
}

export interface IAppModel {
    products: IProductItem[];
    basket: IProductItem[];
    order: IOrder;
}
