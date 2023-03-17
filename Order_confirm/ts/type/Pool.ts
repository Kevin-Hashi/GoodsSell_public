import { SheetUtils } from "../SheetUtils";
import { SS_API_FetchUtils } from "../connect";
import { SheetData } from "../type";
import { SheetIdAndSS_API_URL } from "./SheetIdAndSS_API_URL";

/**
 * It is intended to store logs of something.
 * In generics, T is the type of the Set (`oldSet`) to be built from the sheetData, S is the type of the newly managed Set (`currentSet`), and U is the type when the generated one (`generate()`) is returned.
 */
export abstract class BasePool<T, S = T, U = S>{
    protected readonly oldSet: Set<T> = new Set<T>();
    protected readonly currentSet: Set<S> = new Set<S>();
    protected readonly sheetUtils: SheetUtils;
    protected readonly SS_API_FetchRetry: SS_API_FetchUtils;
    constructor(protected readonly sheetIdAndSS_API_URL: SheetIdAndSS_API_URL) {
        this.sheetUtils = new SheetUtils(sheetIdAndSS_API_URL);
        this.SS_API_FetchRetry = new SS_API_FetchUtils(sheetIdAndSS_API_URL);
    }
    /** Construct an `oldSet` from sheet data. */
    abstract fromSheet(sheetData: SheetData): void;
    /** Write `currentSet` to a sheet as a log. */
    abstract writeLog(sheetName: string): void;
    /** Generate a value and add it to the `currentSet`. */
    abstract generate(): U;
    /** Add to `currentSet`. */
    abstract add(S: S): void;
}
