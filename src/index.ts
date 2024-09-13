import './scss/styles.scss';
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/events";
import { IOrder, IProductItem } from "./types";
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { AppModel, ProductsChangeEvent } from "./components/appModel";
import { Modal } from "./components/modal";
import { BasketView } from "./components/basketView";
import { OrderForm } from "./components/orderForm";
import { ContactsForm } from "./components/contactsForm";
import { PageView } from "./components/pageView";
import { ProductInBasketView, ProductView, ProductViewModal } from "./components/productView";
import { SuccessView } from "./components/successView";
import { WebLarekApi } from './components/webLarekApi';

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const productModal = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const productInBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successOrderTemplate = ensureElement<HTMLTemplateElement>('#success');

const appModel = new AppModel({}, events, [], [], {
    email: '',
    phone: '',
    payment: null,
    address: '',
    total: 0,
    items: []
});

const pageView = new PageView(document.body, events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successView = new SuccessView(cloneTemplate(successOrderTemplate), {
    onClick: () => {
        modal.close();
        events.emit('order:clear');
    },
});

api.getProducts()
    .then(data => appModel.setProducts(data.items))
    .catch(err => {
        console.error(err);
    });

events.on<ProductsChangeEvent>('products:changed', () => {
    pageView.basketCounter = appModel.getBasket().length;
    pageView.catalog = appModel.getProducts().map(item => {
        const product = new ProductView(cloneTemplate(cardCatalogTemplate), {
            onClick: () => {
                events.emit('product:openInModal', item);
            }
        });
        return product.render({
            id: item.id,
            title: item.title,
            image: CDN_URL + item.image,
            category: item.category,
            price: item.price ? `${item.price} синапсов` : 'Бесценно'
        });
    });
});

events.on('product:openInModal', (product: IProductItem) => {
    const card = new ProductViewModal(cloneTemplate(productModal), {
        onClick: () => events.emit('product:addToBasket', product),
    });

    modal.render({
        content: card.render({
            title: product.title,
            image: CDN_URL + product.image,
            category: product.category,
            description: product.description,
            price: product.price ? `${product.price} синапсов` : '',
            status: product.price === null || appModel.getBasket().some(item => item === product)
        }),
    });
});

events.on('modal:open', () => {
    pageView.locked = true;
});

events.on('modal:close', () => {
    pageView.locked = false;
});

events.on('product:addToBasket', (product: IProductItem) => {
    appModel.addProductBasket(product);
    pageView.basketCounter = appModel.getBasket().length
    modal.close();
});

events.on('basket:open', () => {
    const products = appModel.getBasket().map((item, index) => {
        const product = new ProductInBasketView(cloneTemplate(productInBasket), {
            onClick: () => events.emit('product:removeFromBasket', item)
        });
        return product.render({
            index: index + 1,
            id: item.id,
            title: item.title,
            price: item.price
        });
    });
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basketView.render({
                products,
                total: appModel.getTotalPrice()
            })
        ])
    });
});

events.on('product:removeFromBasket', (product: IProductItem) => {
    appModel.removeProductBasket(product);
    pageView.basketCounter = appModel.getBasket().length
});

events.on('order:start', () => {
    if (!appModel.isFirstFormFill()) {
        const data = {
            address: ''
        };
        modal.render({
            content: orderForm.render({
                valid: false,
                errors: [],
                ...data
            })
        });
    } else {
        const data = {
            phone: '',
            email: ''
        };
        modal.render({
            content: contactsForm.render({
                valid: false,
                errors: [],
                ...data
            }),
        });
    }
});

events.on('order:setPaymentType', (data: { paymentType: string }) => {
    appModel.setOrderField("payment", data.paymentType);
});

events.on(/(^order|^contacts)\..*:change/,
    (data: { field: keyof Omit<IOrder, 'items' | 'total'>; value: string }) => {
        appModel.setOrderField(data.field, data.value);
    }
);

events.on('form:errorsChanged', (errors: Partial<IOrder>) => {
    const { email, phone, address, payment } = errors;
    orderForm.valid = !address && !payment;
    orderForm.errors = Object.values(errors)
        .filter((i) => !!i)
        .join(', ');
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values(errors)
        .filter((i) => !!i)
        .join(', ');
});

events.on(/(^order|^contacts):submit/, () => {
    if (!appModel.getOrder().email || !appModel.getOrder().address || !appModel.getOrder().phone) {
        return events.emit('order:start');
    }

    const products = appModel.getBasket();

    api.createOrder({
            ...appModel.getOrder(),
            items: products.map(product => product.id),
            total: appModel.getTotalPrice(),
        })
        .then((result) => {
            modal.render({
                content: successView.render({
                    title: !result.error ? 'Заказ оформлен' : 'Ошибка оформления заказа',
                    description: !result.error ? `Списано ${result.total} синапсов` : result.error,
                }),
            });
            appModel.clearBasket();
            orderForm.resetPaymentButtons();
            appModel.clearOrder();
        })
        .catch(console.error);
});
