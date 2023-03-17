import { TextContent } from "./TextContent";

/** A base of classes for writing HTML in GAS. */
export abstract class GASHtmlElement {
    protected abstract readonly tag: string;
    protected abstract readonly style: string;
    protected children: (GASHtmlElement | TextContent)[] = [];
    appendChild(child: GASHtmlElement | TextContent): GASHtmlElement {
        this.children.push(child);
        return this;
    }
    toHtml(): string {
        const childHtml = this.children.reduce((html, child) => html + child.toHtml(), "");
        return `<${this.tag} style="${this.style}">${childHtml}</${this.tag}>`;
    };
}
