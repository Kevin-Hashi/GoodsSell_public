//@ts-check
window.onload = function () {
    document.getElementById('submitLogin')?.addEventListener("click", submitLogin);
};
async function submitLogin() {
    //@ts-ignore
    const password = document.getElementById("password").value;
    const url = "LOGIN_APIのURL";
    const response = await fetch(url, {
        method: "post",
        body: JSON.stringify({
            loginData: {
                password: password
            }
        })
    });
    console.log(await response.json());
}
