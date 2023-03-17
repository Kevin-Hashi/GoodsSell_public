export interface SheetNamesForCallOptions {
    orderSheetName: string;
    mailLogSheetName: string;
    itemListSheetName: string;
    itemGroupSheetName: string;
    usedOrderNumberSheetName: string;
    propertySheetName: string;
}
export interface CallOptions {
    // Sheet Properties
    sheetId: string;
    sheetNames: SheetNamesForCallOptions;
    SS_API_URL: string;

    // mail Properties
    contact: string;
    sendinblueApiKey: string;
}
