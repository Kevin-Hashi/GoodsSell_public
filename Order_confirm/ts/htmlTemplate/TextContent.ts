export class TextContent {
    constructor(public textContent: string = "") { }
    toHtml(): string {
        return this.textContent;
    }
}
