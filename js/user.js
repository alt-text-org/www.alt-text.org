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

function updateUserBanner() {
    let userName = document.querySelector(".user-name")
    let userIcon = document.querySelector(".user-icon")

    let userInfo = getUserInfo()
    if (userInfo.username) {
        userName.innerHTML = userInfo.username

        let iconPath = accountProviderIcons[userInfo.provider]
        if (iconPath) {
            userIcon.src = iconPath
        } else {
            userIcon.src = accountProviderIcons.anon
        }
    } else {
        userName.innerHTML = "Sign In"
        userIcon.src = accountProviderIcons.anon
    }
}

function saveUserInfo(username, provider) {
    let keepUserLoggedIn = getUserSetting("keepMeLoggedIn")

    let storage;
    if (keepUserLoggedIn) {
        storage = window.localStorage
    } else {
        storage = window.sessionStorage
    }

    let serialized = JSON.stringify({
        username: username,
        provider: provider
    })

    storage.setItem(userStorageKey, serialized)
}

function getUserInfo() {
    let keepUserLoggedIn = getUserSetting("keepMeLoggedIn")

    let storage;
    if (keepUserLoggedIn) {
        storage = window.localStorage
    } else {
        storage = window.sessionStorage
    }

    let rawUserInfo = storage.getItem(userStorageKey)
    if (rawUserInfo) {
        return JSON.parse(rawUserInfo)
    } else {
        return {}
    }
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
    let keepUserLoggedIn = getUserSetting("keepMeLoggedIn")

    let storage;
    if (keepUserLoggedIn) {
        storage = window.localStorage
    } else {
        storage = window.sessionStorage
    }

    storage.setItem(userAuthKey, token)
}

function getUserAuth() {
    let auth = window.sessionStorage.getItem(userAuthKey)
    if (!auth) {
        auth = window.localStorage.getItem(userAuthKey)
    }

    return auth
}

function clearUserAuth() {
    window.sessionStorage.removeItem(userAuthKey)
    window.localStorage.removeItem(userAuthKey)
}

function logIn(username, provider, token) {
    saveUserAuth(token)
    saveUserInfo(username, provider)
    updateUserBanner()
}

function logOut() {
    clearUserAuth()
    clearUserInfo()
    updateUserBanner()
}

updateUserBanner()