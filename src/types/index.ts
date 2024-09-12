export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
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
