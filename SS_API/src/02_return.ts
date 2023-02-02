function returnData(data: Post): GoogleAppsScript.Content.TextOutput {
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify(data));
    return output;
}
