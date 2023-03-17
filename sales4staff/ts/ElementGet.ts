/** Gets the HTML element; will not be null. */
export class GetElement {
    /**
     * Base. Get by id.
     *
     * @seealso {@link https://developer.mozilla.org/ja/docs/Web/API/HTMLElement}
     *
     * @example const element = getHTMLElement("some-element");
     * assert(element instanceof HTMLElement);
     * const notExistElement = getHTMLElement("not-exist-element"); // throws Error
     */
    static getHTMLElement(id: string): HTMLElement | never {
        const element = document.getElementById(id);
        if (!element) throw Error(`element "${id}" not found`);
        return element;
    }

    /**
     * Returns an element with the type specified by generics.
     * It is not public and cannot be used from the outside.
     *
     * @example const spanElement = getHTMLElement<HTMLSpanElement>("span-element");
     * assert(spanElement instanceof HTMLSpanElement);
     * const divElement = getHTMLElement<HTMLDivElement>("div-element");
     * assert(divElement instanceof HTMLDivElement);
     */
    private static getHTMLElementAs<T>(id: string): T {
        return GetElement.getHTMLElement(id) as T;
    }

    /**
     * Returns `HTMLInputElement`.
     *
     * @seealso {@link getHTMLElementAs | GetElement.getHTMLElementAs()}
     * @seealso {@link https://developer.mozilla.org/ja/docs/Web/API/HTMLInputElement}
     *
     * @example const inputElement = getHTMLInputElement("input-element");
     * assert(inputElement instanceof HTMLInputElement);
     */
    static getHTMLInputElement(id: string): HTMLInputElement {
        return GetElement.getHTMLElementAs<HTMLInputElement>(id);
    }

    /**
     * Returns `HTMLButtonElement`.
     *
     * @seealso {@link getHTMLElementAs | GetElement.getHTMLElementAs()}
     * @seealso {@link https://developer.mozilla.org/ja/docs/Web/API/HTMLButtonElement}
     *
     * @example const buttonElement = getHTMLButtonElement("button-element");
     * assert(buttonElement instanceof HTMLButtonElement);
     */
    static getHTMLButtonElement(id: string): HTMLButtonElement {
        return GetElement.getHTMLElementAs<HTMLButtonElement>(id);
    }

    /**
     * Returns `HTMLDivElement`.
     *
     * @seealso {@link getHTMLElementAs | GetElement.getHTMLElementAs()}
     * @seealso {@link https://developer.mozilla.org/ja/docs/Web/API/HTMLDivElement}
     *
     * @example const divElement = getHTMLDivElement("div-element");
     * assert(divElement instanceof HTMLDivElement);
     */
    static getHTMLDivElement(id: string): HTMLDivElement {
        return GetElement.getHTMLElementAs<HTMLDivElement>(id);
    }

    /**
     * Returns `HTMLSpanElement`.
     *
     * @seealso {@link getHTMLElementAs | GetElement.getHTMLElementAs()}
     * @seealso {@link https://developer.mozilla.org/ja/docs/Web/API/HTMLSpanElement}
     *
     * @example const spanElement = getHTMLSpanElement("span-element");
     * assert(spanElement instanceof HTMLSpanElement);
     */
    static getHTMLSpanElement(id: string): HTMLSpanElement {
        return GetElement.getHTMLElementAs<HTMLSpanElement>(id);
    }

    /**
     * Returns `HTMLParagraphElement`. In HTML, it is written as `<p>`.
     *
     * @seealso {@link https://developer.mozilla.org/ja/docs/Web/API/HTMLParagraphElement}
     *
     * @example const paragraphElement = getHTMLParagraphElement("paragraph-element");
     * assert(paragraphElement instanceof HTMLParagraphElement);
     */
    static getHTMLParagraphElement(id: string): HTMLParagraphElement {
        return GetElement.getHTMLElementAs<HTMLParagraphElement>(id);
    }
}
