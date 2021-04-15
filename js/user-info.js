const userStorageKey = "userInfo";

const accountProviderIcons = {
    google: "images/google-user-icon.svg",
    email: "images/email-user-icon.svg",
    twitter: "images/twitter-user-icon.svg",
    facebook: "images/facebook-user-icon.svg",
    linkedin: "images/linkedin-user-icon.svg",
    anon: "images/anon-user-icon.svg"
};

(function () {
    let userName = document.querySelector(".user-name")
    let userIcon = document.querySelector(".user-icon")

    let rawUserInfo = window.sessionStorage.getItem(userStorageKey)
    if (!rawUserInfo) {
        rawUserInfo = window.localStorage.getItem(userStorageKey)
    }

    if (rawUserInfo) {
        let userInfo = JSON.parse(rawUserInfo)
        userName.innerHTML = userInfo.username

        let iconPath = accountProviderIcons[userInfo.provider]
        if (iconPath) {
            userIcon.src = iconPath
        }
    } else {
        userName.innerHTML = "Sign In"
        userIcon.src = accountProviderIcons.anon
    }
})()

function saveUserInfo(username, provider, storage) {
    let serialized = JSON.stringify({
        username: username,
        provider: provider
    })

    storage.setItem(userStorageKey, serialized)
}

function clearUserInfo() {
    window.localStorage.removeItem(userStorageKey)
    window.sessionStorage.removeItem(userStorageKey)
}