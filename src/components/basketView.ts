import { Component } from "./base/component";
import { IEvents } from "./base/events";
import { createElement, ensureElement } from "../utils/utils";

interface IBasketView {
    products: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected _basket: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._basket = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:start');
            });
        }
        
        this.products = [];
    }

    toggleButton(state: boolean) {
        this.setDisabled(this._button, state);
    }

    set products(products: HTMLElement[]) {
        if (products.length) {
            this._basket.replaceChildren(...products);
            this.toggleButton(false);
        } else {
            this._basket.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'Корзина пуста',
                })
            );
            this.toggleButton(true);
        }
    }

    set total(total: number) {
        this.setText(this._total, total.toString() + ' синапсов');
    }
}