import { Model } from "./base/model";
import { FormErrors, IAppModel, IOrder, IProductItem } from "../types";
import { IEvents } from "./base/events";

export type ProductsChangeEvent = {
    products: IProductItem[];
}

export class AppModel extends Model<IAppModel> {
    private products: IProductItem[];
    private basket: IProductItem[];
    private order: IOrder;
    private formErrors: FormErrors = {};

    constructor(data: Partial<IAppModel>, events: IEvents, products: IProductItem[], basket: IProductItem[], order: IOrder) {
        super(data, events);
        this.products = products;
        this.basket = basket;
        this.order = order;
    }

    setProducts(products: IProductItem[]) {
        this.products = products;
        this.emitChanges('products:changed', { products: this.products });
    }

    getProducts() {
        return this.products;
    }

    getBasket() {
        return this.basket;
    }

    addProductBasket(product: IProductItem) {
        if (!this.basket.some(item => item === product)) {
            this.basket.push(product);
        }
    }

    getTotalPrice() {
        return this.basket.map(product => product.price)
            .reduce((prev, current) => prev + current, 0);
    }

    removeProductBasket(product: IProductItem) {
        this.basket = this.basket.filter(item => item !== product);
        this.emitChanges('basket:open');
    }

    getOrder() {
        return this.order;
    }

    isFirstFormFill() {
        if (this.order === null) {
            return false;
        }
        return this.order.address && this.order.payment;
    }

    setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string) {
        this.order[field] = value;
        if (this.validateOrder(field)) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder(field: keyof IOrder) {
        const errors: Partial<Record<keyof IOrder, string>> = {};

        if (field === 'email' || field === 'phone') {
            const emailError = !this.order.email.match(/^\S+@\S+\.\S+$/)
                ? 'email'
                : '';
            const phoneError = !this.order.phone.match(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/) 
                ? 'телефон'
                : '';

            if (emailError && phoneError) {
                errors.email = `Необходимо указать ${emailError} и ${phoneError}`;
            } else if (emailError) {
                errors.email = `Необходимо указать ${emailError}`;
            } else if (phoneError) {
                errors.phone = `Необходимо указать ${phoneError}`;
            }
        } else if (!this.order.address) errors.address = 'Необходимо указать адрес';
        else if (!this.order.payment)
            errors.address = 'Необходимо выбрать способ оплаты';

        this.formErrors = errors;
        this.events.emit('form:errorsChanged', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    clearBasket() {
        this.basket = [];
        this.emitChanges('products:changed', { products: this.products });
    }

    clearOrder() {
        this.order = {
            payment: null,
            address: '',
            email: '',
            phone: '',
            total: 0,
            items: [],
        };
    }
}