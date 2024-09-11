import { Component } from "./base/component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

interface IPage {
    basketCounter: number;
    products: HTMLElement[];
    locked: boolean;
}

export class PageView extends Component<IPage> {
    private _basketCounter: HTMLElement;
    private _gallery: HTMLElement;
    private _basket: HTMLElement;
    private _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
        this._gallery = ensureElement<HTMLElement>('.gallery');
        this._basket = ensureElement<HTMLElement>('.header__basket');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set catalog(products: HTMLElement[]) {
        this._gallery.replaceChildren(...products);
    }

    set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }

    set basketCounter(counter: number) {
        this.setText(this._basketCounter, counter);
    }
}
