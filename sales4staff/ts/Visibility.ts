import { GetElement } from "./ElementGet";

/**
 * Sets the visibility/invisibility of HTML elements.
 */
export module Visibility {
    /**
     * Add a class of `.hide` to the specified element.
     *
     * @example Visibility.invisible('some-element');
     * assert(GetElement.getHTMLElement('some-element').classList.contains('hide'));
     */
    export function invisible(id: string): void {
        const element = GetElement.getHTMLElement(id);
        element.classList.add("hide");
    }
    /**
     * Remove a class of `.hide` from the specified element.
     *
     * @example Visibility.visible('some-element');
     * assert(!GetElement.getHTMLElement('some-element').classList.contains('hide'));
     */
    export function visible(id: string): void {
        const element = GetElement.getHTMLElement(id);
        element.classList.remove("hide");
    }
}
