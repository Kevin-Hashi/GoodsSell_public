/** Elements of the breadcrumb list. */
export class Breadcrumb {
    readonly element: HTMLSpanElement;
    /** Returns the onclick of the element that is actually displayed. */
    get onclick(): ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null {
        return this.element.onclick;
    }

    /**
     * Set to onclick on the element that will actually be displayed.
     * @example hogeBreadcrumb.onclick = (ev) => console.log(ev);
     */
    set onclick(f: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null) {
        this.element.onclick = f;
    }

    /**
     * Internally, a span element is generated and set to this.element.
     * @seealso {@link Breadcrumb.element | Breadcrumb.element}
     * @example const hogeBreadcrumb = new Breadcrumb('hogeHTMLId', ['breadcrumb'], 'ほげページ');
     */
    constructor(id: string, classList: string[] | [], text: string | null) {
        const breadcrumb = document.createElement('span');
        breadcrumb.id = id;
        breadcrumb.classList.add(...classList);
        breadcrumb.textContent = text;
        this.element = breadcrumb;
    }

    /**
     * Remove elements from the breadcrumb list.
     * The element is not removed from the variable.
     *
     * Generally, it is executed from `BreadcrumbList.removeLast()` or `BreadcrumbList.removeUntil()`.
     * @seealso {@link BreadcrumbList.removeLast | BreadcrumbList.removeLast()}
     * @seealso {@link BreadcrumbList.removeUntil | BreadcrumbList.removeUntil()}
     * @example hogeBreadcrumb.removeFromDOM();
     * assert(!breadcrumbListWrapperElement.contains(hogeBreadcrumb.element));
     */
    removeFromDOM(): HTMLSpanElement | never {
        const parentNode = this.element.parentNode;
        if (!parentNode) throw Error('Breadcrumb not attached to DOM');
        return parentNode.removeChild(this.element);
    }

    /**
     * Add to the breadcrumb list.
     *
     * Generally, it is executed from `BreadcrumbList.addLast()`.
     * @seealso {@link BreadcrumbList.addLast | BreadcrumbList.addLast()}
     * @example hogeBreadcrumb.addToDOM(breadcrumbListWrapperElement);
     * assert(breadcrumbListWrapperElement.contains(hogeBreadcrumb.element));
     */
    attachToDOM(parentElement: HTMLElement): void {
        parentElement.appendChild(this.element);
    }
}

/** Breadcrumbs list body. */
export class BreadcrumbList {
    readonly list = Array<Breadcrumb>();

    /** Returns the one at the end of the list (usually the page you are on). */
    get last(): Breadcrumb | undefined { return [...this.list].reverse()[0]; }

    private containerElement: HTMLElement;

    /**
     * @example const breadcrumbList = new BreadcrumbList(breadcrumbListWrapperElement, firstBreadcrumb);
     */
    constructor(containerElement: HTMLElement, firstElement: Breadcrumb) {
        this.containerElement = containerElement;
        this.addElement(firstElement);
    }

    /**
     * Adds an element to the list of member variables.
     * Adding an element to this is not enough to display it.
     * It is displayed by using `addLast`, and this method is called at that time.
     *
     * This is used in `constructor` and `addLast`.
     * @seealso {@link BreadcrumbList.constructor | BreadcrumbList.constructor()}
     * @seealso {@link BreadcrumbList.addLast | BreadcrumbList.addLast()}
     */
    private addElement(element: Breadcrumb): number {
        return this.list.push(element);
    }

    /**
     * Determines if the list contains elements.
     *
     * This is used in `removeUntil`.
     * @seealso {@link BreadcrumbList.removeUntil | BreadcrumbList.removeUntil()}
     */
    private include(element: Breadcrumb): boolean {
        return this.list.includes(element);
    }

    /**
     * Determines if the last element in the list is an argument element.
     *
     * This is used in `removeUntil`.
     * @seealso {@link BreadcrumbList.removeUntil | BreadcrumbList.removeUntil()}
     */
    private lastIs(element: Breadcrumb): boolean {
        return this.last === element;
    }

    /**
     * Add elements to the breadcrumb list.
     * `element.attachToDOM` is called and `addElement` is also called at this time.
     *
     * @seealso {@link Breadcrumb.attachToDOM | Breadcrumb.attachToDOM()}
     * @seealso {@link BreadcrumbList.addElement | BreadcrumbList.addElement()}
     *
     * @example breadcrumbList.addLast(hogeBreadcrumb);
     * assert(breadcrumbList.last === hogeBreadcrumb);
     * assert(breadcrumbListWrapperElement.contains(hogeBreadcrumb.element));
     */
    addLast(element: Breadcrumb): void {
        element.attachToDOM(this.containerElement);
        this.addElement(element);
    }

    /**
     * Remove the last of the breadcrumb list from the list.
     * This is where `element.removeFromDOM` is called.
     *
     * @seealso {@link Breadcrumb.removeFromDOM | Breadcrumb.removeFromDOM()}
     *
     * @example const lastBreadcrumb = breadcrumbList.last as Breadcrumb;
     * const removedElement = breadcrumbList.removeLast();
     * assert(!breadcrumbList.list.includes(lastBreadcrumb));
     * assert(lastBreadcrumb.element === removedElement);
     */
    removeLast(): HTMLSpanElement {
        const element = this.list.pop();
        if (element === undefined) throw Error('Breadcrumb is not contained list');
        return element.removeFromDOM();
    }

    /**
     * Remove the element from the list up to the specified element.
     * The element is not removed from the list.
     *
     * @seealso {@link BreadcrumbList.include | BreadcrumbList.include()}
     * @seealso {@link BreadcrumbList.lastIs | BreadcrumbList.lastIs()}
     * @seealso {@link BreadcrumbList.removeLast | BreadcrumbList.removeLast()}
     *
     * @example breadcrumbList.removeUntil(hogeBreadcrumb);
     * assert(breadcrumbList.last === hogeBreadcrumb);
     * assert(!breadcrumbList.list.includes(nextHogeBreadcrumb));
     * assert(!breadcrumbList.list.includes(next2HogeBreadcrumb));
     */
    removeUntil(element: Breadcrumb): void | never {
        if (!this.include(element)) throw Error('Breadcrumb not found');
        while (!this.lastIs(element)) {
            this.removeLast();
        }
    }
}
