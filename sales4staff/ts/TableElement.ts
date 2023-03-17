/**
 * It is used to put text into TextContent in HTML (especially those that inherit from TableElement).
 */
export class TextContent {
    /**
     * @example const textContent = new TextContent('hoge');
     */
    constructor(public textContent: string = "") { }
    /**
     * Used to convert to HTML.
     * Usually called from the parent element.
     *
     * @example textContent.toHtml(); // hoge
     */
    toHtml(): string { return this.textContent; }
}

/**
 * It is used to create text for HTML table elements.
 * This requires inheritance.
 *
 * @example class TableHeadElement extends TableElement {
 *     protected override readonly tag = "thead";
 * }
 */
abstract class TableElement {
    protected abstract readonly tag: "thead" | "tbody" | "tfoot" | "tr" | "td" | "th";
    protected children: (TableElement | TextContent)[] = [];
    /**
     * Pack child elements.
     *
     * @seealso {@link TextContent}
     *
     * @example tableHeadElement.appendChild(trElement);
     */
    appendChild(child: TableElement | TextContent): TableElement {
        this.children.push(child); return this;
    }
    /**
     * Called when converting to HTML text.
     * It is called recursively for children.
     *
     * @example tableHeadElement.toHtml(); // <thead><tr><th>a</th><th>b</th></tr></thead>
     */
    toHtml(): string {
        const childHtml = this.children.reduce((html, child) => html + child.toHtml(), "");
        return `<${this.tag}>${childHtml}</${this.tag}>`;
    }
}

/** Use as thead */
export class TableHead extends TableElement {
    protected override readonly tag = "thead";
}

/** Use as tbody */
export class TableBody extends TableElement {
    protected override readonly tag = "tbody";
}

/** Use as tr */
export class Tr extends TableElement {
    protected override readonly tag = "tr";
}

/** Use as th */
export class Th extends TableElement {
    protected override readonly tag = "th";
}

/** Use as td */
export class Td extends TableElement {
    protected override readonly tag = "td";
}
