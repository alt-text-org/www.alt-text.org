const userStorageKey = "userInfo";
const userAuthKey = "userAuth";
const userSettingsKey = "userSettings";

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

function isUserLoggedIn() {
    return !!window.sessionStorage.getItem(userStorageKey) || !!window.localStorage.getItem(userStorageKey)
}


function getUserSettings() {
    let rawSettings = window.localStorage.getItem(userSettingsKey);
    if (rawSettings) {
        return JSON.parse(rawSettings)
    } else {
        return {}
    }
}

function getUserSetting(key, defaultValue = null, transform = e => e) {
    let settings = getUserSettings()
    if (settings[key]) {
        return transform(settings[key])
    } else {
        return defaultValue
    }
}

function setUserSetting(setting, value) {
    let settings = getUserSettings()
    if (typeof value === "object" || Array.isArray(value)) {
        settings[setting] = JSON.stringify(value)
    } else {
        settings[setting] = value
    }

    window.localStorage.setItem(userSettingsKey, JSON.stringify(settings))
}

function saveUserAuth(token) {
    let settings = getUserSettings()
    if (settings.keepMeLoggedIn) {
        window.localStorage.setItem(userAuthKey, token)
    } else {
        window.sessionStorage.setItem(userAuthKey, token)
    }
}

function getUserAuth() {
    let auth = window.sessionStorage.getItem(userAuthKey)
    if (!auth) {
        auth = window.localStorage.getItem(userAuthKey)
    }

    return auth
}

function logOut() {
    window.sessionStorage.removeItem()
}