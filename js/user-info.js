const accountProviderIcons = {
    google: "images/google-user-icon.svg",
    email: "images/email-user-icon.svg",
    twitter: "images/twitter-user-icon.svg",
    anon: "images/anon-user-icon.svg"
}

(function () {
    let userName = document.querySelector(".user-name")
    let userIcon = document.querySelector(".user-icon")

    let rawUserInfo = window.sessionStorage.getItem("userInfo")
    if (!rawUserInfo) {
        rawUserInfo = window.localStorage.getItem("userInfo")
    }

    if (rawUserInfo) {
        let userInfo = JSON.parse(rawUserInfo)
        userName.innerHTML = userInfo.username

        let iconPath = accountProviderIcons[userInfo.provider]
        if (iconPath) {
            userIcon.src = iconPath
        }
    }
})()