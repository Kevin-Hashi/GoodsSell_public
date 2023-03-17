import { GASHtmlElement } from "./element";

export class Td extends GASHtmlElement {
    protected override readonly tag: string = "td";
    protected override readonly style: string = "box-sizing: inherit; border: none; padding: 15px 5px; display: table-cell; text-align: left; vertical-align: middle; border-radius: 2px;";
}
