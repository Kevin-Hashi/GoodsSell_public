import { GASHtmlElement } from "./element";

export class Tr extends GASHtmlElement {
    protected override readonly tag: string = "tr";
    protected override readonly style: string = "box-sizing: inherit; border-bottom: 1px solid rgba(0, 0, 0, 0.12);";
}
