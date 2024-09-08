## Проектная работа "Веб-ларек"

https://github.com/Artewolfves/web-larek-frontend.git

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
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

## Архитектура приложения

Код приложения основан на подходе MVP (Model-View-Presenter), т.к. слой данных отвечает за хранение и изменение данных; слой представления, отвечает за отображение данных на странице; презентер, отвечает за связь представления и данных.

## Типы данных

interface IProductItem {  
id: string - id товара  
description: string - описание  
image: string - картинка  
title: string - название  
category: CategoryProduct - категория  
price: number | null - стоимость  
}

type CategoryProduct  
"софт-скил" | "другое" | "дополнительное" | "кнопка" | "хард-скил"

interface IOrder {  
payment: OrderPayment - тип оплаты  
email: string - email покупателя  
phone: string - телефон покупателя  
address: string - адрес покупателя  
total: number - сумма заказа  
items: IProduct[] - список товаров в заказе  
errors: FormErrors - ошибки формы  
}

type OrderPayment = "online" | "cash"

interface IBasket {  
list: HTMLElement[];  
total: number;  
}

type FormErrors = {  
email?: string;  
phone?: string;  
address?: string;  
payment?: string;  
}

interface ISuccess {  
title: string;  
description: string;  
}

## Описание базовых классов

## Класс Api

Базовый класс для работы с Api, содержит в себе логику отправки запросов на сервер.

Класс имеет методы:
`handleResponse(response: Response): Promise<object>` - обработчик ответа сервера.
`get(uri: string)` - выполняет GET запросы и возвращает ответ от сервера.
`post(uri: string, data: object, method: ApiPostMethods = 'POST')` - выполняет запрос к Api с использованием методов(POST|PUT|DELETE).

## Класс EventEmitter

Реализует брокер событий, позволяет устанавливать и снимать слушатели событий, вызвать слушатели при возникновении события

Класс имеет методы:
`on` — добавление обработчика на определенное событие
`off` — удаление обработчика с определенного события
`emit` — уведомления подписчиков о наступлении события
`onAll` и `offAll` — добавление обработчиков на все события и удаление всех обработчиков.
`trigger` - генерирует заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса EventEmitter.

## Класс Component

Базовый класс для представлений.

Класс имеет методы:

`toggleClass(element: HTMLElement, className: string, force?: boolean)` - для переключения класса элемента
`setText(element: HTMLElement, value: unknown)` - установить текст элементу
`setDisabled(element: HTMLElement, state: boolean)` - установить (снять) атрибут disabled
`setHidden(element: HTMLElement)` - скрыть элемент
`setVisible(element: HTMLElement)` - показать элемент
`setImage(element: HTMLImageElement, src: string, alt?: string)` - установить изображение элементу с альтернативным текстом (если он передан)
`render(data?: Partial<T>)` - возвращает элемент с заполненными данными

## Класс Model

Абстрактный класс для создания классов моделей данных на его основе

Конструктор:

- `constructor(data: Partial<T>, protected events: IEvents)` - принимает данные выбранного нами типа и экземпляр `IEvents` для работы с событиями

Класс имеет методы:

- `emitChanges(event: string, payload?: object)` - сообщает всем, что модель изменилась. Принимает на вход событие и данные, которые изменились

## Классы данных

## Класс AppModel

Класс наследуется от базового класса Model. Является общей моделью данных всего приложения.

Свойства:

- products: IProductItem[] - массив id товаров
- basket: IProductItem[] - массив товаров в корзине
- order: IOrder - заказ
- selectedProduct: string | null - id товара для отображения в модальном окне

Методы:

- `setProducts` - записывает товары для главной страницы
- `selectProduct` - выбор товара для отображения в модальном окне
- `addProductBasket` - добавление товара в корзину
- `removeProductBasket` - удаление товара из корзины
- `getBasketProducts` - получение товаров в корзине
- `getTotalPrice` - получение стоимости всей корзины
- `clearBasket` - очищает корзину
- `clearOrder` - очищает текущий заказ

## Классы представлений

## Класс Modal

Класс Modal расширяет базовый класс Component, являясь представлением модального окна

constructor(HTMElement, IEvents)- Вызывает конструктор родительского класса Component и инициализирует элементы модального окна. Устанавливает обработчики событий для кнопки закрытия, самого модального окна и его содержимого.

Свойства:

- closeButton: HTMLButtonElement - кнопка закрытия модального окна
- content: HTMLElement - содержимое модального окна

Основные методы:

- `set content` - устанавливает содержимое модального окна
- `handleEsc` = (event: KeyboardEvent) - обработчик события нажатия клавиши Esc, вызывает метод close()
- `open` - откртывает модальное окно, добавляя класс modal_active и инициирует событие modal:open, а также устанавливает слушатель события keydown
- `close` - закрывает модальное окно, удаляя класс modal_active, очищает содержимое и инициирует событие "modal:close", а так же удаляет слушатель события keydown
- `render`- переопределенный родительский метод отрисовки модального окна

## Класс Form

Расширяет базовый класс Component. Описывает представление форм в приложении

constructor(HTMLFormElement, IEvents)- вызывает конструктор родительского класса Component и инициализирует элементы формы. Устанавливает обработчики событий для ввода данных и отправки формы

Свойства:

- submit: HTMLButtonElement - кнопка отправки формы
- errors: HTMLElement - элемент для отображения ошибок

Методы:

- `onInputChange` - изменение значений полей ввода формы
- `set valid(boolean)`- блокирует кнопку отправки
- `set errors(string)`- устанавливает ошибку

## Класс OrderForm

Расширяет класс Form и описывает представление формы ввода адреса и выбора метода оплаты

constructor(HTMLFormElement, IEvents)- вызывает конструктор родительского класса Form, передавая ему форму и объект событий, а также инициализирует кнопки выбора метода оплаты.

Свойства:

- buttonOnlinePayment: HTMLButtonElement - кнопка выбора онлайн оплаты
- buttonCashPayment: HTMLButtonElement - кнопка выбора оплаты при получении
- inputAddress: HTMLInputElement - поле ввода адреса

Методы:

- `togglePayment` - перекчлючает способ оплаты
- `set address(string)` - устанавливает адрес
- `set payment(string)` - устанавливает способ оплаты

## Класс ContactsForm

Расширяет класс Form и описывает представление формы ввода номера телефона, email покупателя

constructor(HTMLFormElement, IEvents)- Вызывает конструктор родительского класса Form, передавая ему форму и объект событий.

Свойства:

- inputEmail: HTMLInputElement - поле ввода email
- inputPhone: HTMLInputElement - поле ввода телефона

Методы:

- `set phone(string)` - устанавливает номер телефона покупателя
- `set email(string)` - устанаваливает email поокупателя

## Класс ProductView

Наследуется от базового класса Component, отображает товары на главной странице

Свойства:

- image: HTMLImageElement;
- title: HTMLElement;
- category: HTMLElement;
- price: HTMLElement;
- button: HTMLButtonElement;

## Класс BasketView

Отображение корзины в модальном окне, наследуется от базового класса Component

constructor(HTMLElement, IEvents) - вызывает конструктор родительского класса Component

Свойства:

- basket: HTMLElement[] - список товаров в корзине
- total: number | null - сумма покупок
- button: HTMLButtonElement - кнопка оформления заказа

Методы:

- `toggleButton` - устанавливает или удаляется свойство disabled у элемента кнопки
- `set products` - установливает список товаров в корзине или указвает сообщение, что корзина пуста
- `set total` - установливает общую сумму товаров в корзине

## Класс SuccessView

Отображение успешного заказа товаров, наследуется от базового класса Component

Свойства:

- title: HTMLElement
- description: HTMLElement
- close: HTMLElement

Методы:

`set title(string)` - устанаваливает текст успешного заказа
`set description(string)` - устанавливает текст с описанием и стоимостью

## Класс PageView

Отображение главной страницы с счетчиком товаров в корзине, наследуется от базового класса Component

constructor(HTMLElement, IEvents)- конструктор класса, принимающий элемент страницы и объект событий. Вызывает конструктор родительского класса Component и инициализирует элементы страницы

Свойства:

- basketCounter: HTMLElement - счетчик товаров в корзине
- gallery: HTMLElement - отображение карточек товара
- basket: HTMLButtonElement - элемент кнопки открытия корзины
- wrapper: HTMLElement - элемент обёртки

Метооды:

- `set basketCounter`- устанавливает счётчик товаров в корзине
- `set catalog`- выводит список товаров
- `set locked`- блокирует/разблокирует прокрутку страницы, установливает класс элементу \_wrapper
