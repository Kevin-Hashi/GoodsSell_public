function doPost(e: GoogleAppsScript.Events.DoPost) {
    //@ts-ignore
    const loginData: LoginData = JSON.parse(e.postData.getDataAsString()).loginData;
    const salt = "q8BhHWeWSnTidTPc";
    const hash = CryptoJS.SHA3(loginData.password + salt).toString(CryptoJS.enc.Hex);
    const hashD = "35bbfa09661a863dba23c146f47397952177c9c927d64b48ea572a5224823dbcf4bc4216b372a01d85b5d47b376da9b709a63f32db8d1e1fa47c5c57a43d8086";
    if (hash === hashD) {
        return returnData({ status: "success" });
    } else {
        return returnData({ status: "fail" });
    }
}
function returnData(data: object): GoogleAppsScript.Content.TextOutput {
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.TEXT);
    output.setContent(JSON.stringify(data));
    return output;
}
