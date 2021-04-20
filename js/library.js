const urlRegex = new RegExp('^https?://.+', 'iu')

function validateUrl(url) {
    return urlRegex.test(url)
}

function selectLeft(leftTab, rightTab) {
    selectTab(leftTab)
    deselectTab(rightTab)
    rightTab.style.borderRight = "3px #AAAAAA solid"
}

function selectRight(leftTab, rightTab) {
    selectTab(rightTab)
    deselectTab(leftTab)
    leftTab.style.borderLeft = "3px #AAAAAA solid"
}

function selectTab(tab) {
    let style = tab.style;
    style.color = "black"
    style.borderBottom = "hidden"
    style.borderRight = "3px black solid"
    style.borderLeft = "3px black solid"
    style.borderTop = "3px black solid"
    style.zIndex = "501"
}

function deselectTab(tab) {
    let style = tab.style;
    style.color = "#AAAAAA"
    style.borderTop = "3px #AAAAAA solid"
    style.borderBottom = "3px black solid"
    style.zIndex = "500"
}

function setButtonEnabled(button, enabled) {
    if (enabled) {
        button.classList.remove("button-disabled")
        button.classList.add("button-enabled")
    } else {
        button.classList.add("button-disabled")
        button.classList.remove("button-enabled")
    }
}

const apiClient = new AltText.Client.AltTextClient()

// Prefetch favorites
async function prefetchFavorites() {
    if (!isUserLoggedIn()) {
        return {};
    }

    let favorites = await apiClient.getUserFavorites()
    let faveMap = {}

    favorites.forEach(fave => {
        if (!faveMap[fave.imageHash]) {
            faveMap[fave.imageHash] = {}
        }

        faveMap[fave.imageHash][fave.language] = fave
    })

    return faveMap
}

let favorites = prefetchFavorites();

// Prefetch user's texts
async function prefetchUserTexts() {
    if (!isUserLoggedIn()) {
        return {};
    }

    let userTexts = await apiClient.getUserAltText()
    let userTextMap = {}

    userTexts.forEach(text => {
        if (!userTextMap[text.imageHash]) {
            userTextMap[text.imageHash] = {}
        }

        userTextMap[text.imageHash][text.language] = text
    })

    return userTextMap
}

let userTexts = prefetchUserTexts();

async function getFavesAndUserTexts(imageHash, language) {
    let result = {}
    let foundAny = false
    await favorites.then(faves => {
        if (faves[imageHash] && faves[imageHash][language]) {
            result.favorite = faves[imageHash][language]
            foundAny = true
        }
    })

    await userTexts.then(userTexts => {
        if (userTexts[imageHash] && userTexts[imageHash][language]) {
            result.userText = userTexts[imageHash][language]
            foundAny = true
        }
    })

    return foundAny ? result : null
}

function buildResultPage(imageHash, language, results, loggedIn, intensityHist, faves) {
    const resultDiv = document.createElement("div")

    let zebraDark = false

    results.forEach(result => {
        let faved = false
        if (faves[imageHash] && faves[imageHash][language] && faves[imageHash][language].userHash === result.userHash) {
            faved = true
        }

        let bgClass = zebraDark ? "alt-text-bg-zebra-dark" : "alt-text-bg-zebra-light"
        let textDiv = buildTextDiv(result, false, loggedIn, faved, () => intensityHist, bgClass)
        resultDiv.appendChild(textDiv)
    })

    return resultDiv
}

function setupResultDisplay(imageHash, language, result, loggedIn, intensityHist, url, faves) {
    const exactMatchTitle = document.querySelector(".exact-match-title")
    const exactMatchDiv = document.querySelector(".exact-matches")
    if (exactMatchDiv.firstChild) {
        exactMatchDiv.removeChild(exactMatchDiv.firstChild)
    }

    const ocrResultTitle = document.querySelector(".ocr-result-title")
    const ocrResultDiv = document.querySelector(".ocr-result")
    if (ocrResultDiv.firstChild) {
        ocrResultDiv.removeChild(ocrResultDiv.firstChild)
    }

    const strongMatchTitle = document.querySelector(".strong-match-title")
    const strongMatchDiv = document.querySelector(".strong-matches")
    if (strongMatchDiv.firstChild) {
        strongMatchDiv.removeChild(strongMatchDiv.firstChild)
    }

    const weakMatchTitle = document.querySelector(".weaker-match-title")
    const weakMatchDiv = document.querySelector(".weaker-matches")
    if (weakMatchDiv.firstChild) {
        weakMatchDiv.removeChild(weakMatchDiv.firstChild)
    }

    let pages = splitResults(result.texts)
    let tabWidth = 12 / Object.keys(pages).length
    let tabStart = 0

    let exactTab = null
    let ocrTab = null
    let strongTab = null
    let weakTab = null

    let start = null

    if (pages.exact.length > 0) {
        let page = buildResultPage(imageHash, language, pages.exact, loggedIn, intensityHist, faves)
        exactMatchDiv.appendChild(page)
        exactTab = exactMatchTitle
        start = () => {
            exactMatchDiv.style.display = "block"
            changeResultTab(exactTab, ocrTab, strongTab, weakTab)
        }
        exactMatchTitle.style.gridColumnStart = `${tabStart}`
        exactMatchTitle.style.gridColumnEnd = `span ${tabWidth}`
        tabStart += tabWidth
    }

    if (result.extractedText) {
        setupOcrPage(imageHash, language, result.extractedText, intensityHist, url)
        ocrTab = ocrResultTitle
        if (!start) {
            start = () => {
                ocrResultDiv.style.display = "block"
                changeResultTab(ocrTab, exactTab, strongTab, weakTab)
            }
        }
        ocrResultTitle.style.gridColumnStart = `${tabStart}`
        ocrResultTitle.style.gridColumnEnd = `span ${tabWidth}`
        tabStart += tabWidth
    }

    if (pages.strong.length > 0) {
        let page = buildResultPage(imageHash, language, pages.strong, loggedIn, intensityHist, faves)
        strongMatchDiv.appendChild(page)
        strongTab = strongMatchTitle
        if (!start) {
            start = () => {
                strongMatchDiv.style.display = "block"
                changeResultTab(strongTab, exactTab, ocrTab, weakTab)
            }
        }
        strongMatchTitle.style.gridColumnStart = `${tabStart}`
        strongMatchTitle.style.gridColumnEnd = `span ${tabWidth}`
        tabStart += tabWidth
    }

    if (pages.weak.length > 0) {
        let page = buildResultPage(imageHash, language, pages.weak, loggedIn, intensityHist, faves)
        weakMatchDiv.appendChild(page)
        weakTab = weakMatchTitle
        if (!start) {
            start = () => {
                weakMatchDiv.style.display = "block"
                changeResultTab(weakTab, exactTab, ocrTab, strongTab)
            }
        }
        weakMatchTitle.style.gridColumnStart = `${tabStart}`
        weakMatchTitle.style.gridColumnEnd = `span ${tabWidth}`
    }

    setupResultTabs(exactMatchTitle, ocrResultTitle, strongMatchTitle, weakMatchTitle, exactTab, ocrTab, strongTab, weakTab)
    if (start) {
        start()
    } else {
        throw new Error("No tab selected for start!")
    }
}

function changeResultTab(tabToSelect, otherTab1, otherTab2, otherTab3) {
    tabToSelect.style.borderBottom = "none"
    tabToSelect.style.borderLeft = "3px black solid"
    tabToSelect.style.borderRight = "3px black solid"
    tabToSelect.style.borderTop = "3px black solid"
    tabToSelect.style.zIndex = "501"

    if (otherTab1) {
        otherTab1.style.borderBottom = "3px black solid"
        otherTab1.style.borderLeft = "3px #555555 solid"
        otherTab1.style.borderRight = "3px #555555 solid"
        otherTab1.style.borderTop = "3px #555555 solid"
        otherTab1.style.zIndex = "500"
    }

    if (otherTab2) {
        otherTab2.style.borderBottom = "3px black solid"
        otherTab2.style.borderLeft = "3px #555555 solid"
        otherTab2.style.borderRight = "3px #555555 solid"
        otherTab2.style.borderTop = "3px #555555 solid"
        otherTab2.style.zIndex = "500"
    }

    if (otherTab3) {
        otherTab3.style.borderBottom = "3px black solid"
        otherTab3.style.borderLeft = "3px #555555 solid"
        otherTab3.style.borderRight = "3px #555555 solid"
        otherTab3.style.borderTop = "3px #555555 solid"
        otherTab3.style.zIndex = "500"
    }
}

function changeResultPage(bodyToSelect, otherBody1, otherBody2, otherBody3) {
    otherBody1.style.display = "none"
    otherBody2.style.display = "none"
    otherBody3.style.display = "none"
    bodyToSelect.style.display = "block"
}

function setupResultTabs(
    exactMatchTitle, ocrResultTitle, strongMatchTitle, weakMatchTitle,
    exactMatchDiv, ocrResultDiv, strongMatchDiv, weakMatchDiv
) {
    exactMatchTitle.addEventListener("click", () => {
        changeResultPage(exactMatchDiv, ocrResultDiv, strongMatchDiv, weakMatchDiv)
        changeResultTab(exactMatchTitle, ocrResultTitle, strongMatchTitle, weakMatchTitle)
    })

    ocrResultTitle.addEventListener("click", () => {
        changeResultPage(ocrResultDiv, exactMatchDiv, strongMatchDiv, weakMatchDiv)
        changeResultTab(ocrResultTitle, exactMatchTitle, strongMatchTitle, weakMatchTitle)
    })

    strongMatchTitle.addEventListener("click", () => {
        changeResultPage(strongMatchDiv, exactMatchDiv, ocrResultDiv, weakMatchDiv)
        changeResultTab(strongMatchTitle, exactMatchTitle, ocrResultTitle, weakMatchTitle)
    })

    weakMatchTitle.addEventListener("click", () => {
        changeResultPage(weakMatchDiv, exactMatchDiv, ocrResultDiv, strongMatchDiv)
        changeResultTab(weakMatchTitle, exactMatchTitle, ocrResultTitle, strongMatchTitle)
    })
}

function splitResults(resultTexts) {
    let result = {
        exact: [],
        strong: [],
        weak: []
    }

    resultTexts.forEach(text => {
        if (text.confidence === 1.0) {
            result.exact.push(text)
        } else if (text.confidence > 0.85) {
            result.strong.push(text)
        } else {
            result.weak.push(text)
        }
    })

    return result
}

function setupOcrPage(imageHash, language, text, intensityHist, url) {
    const saveButton = getFreshButton(".ocr-result-save")
    const editButton = getFreshButton(".ocr-edit-button")

    const ocrTextDiv = document.querySelector(".ocr-result-text")
    ocrTextDiv.innerHTML = text

    const resultPage = document.querySelector(".search-results")
    saveButton.addEventListener("click", () => {
        apiClient.publishAltText(imageHash, language, text, intensityHist, url)
            .then(() => {
                resultPage.style.display = "none"
                openPublished(imageHash, language, text, intensityHist)
            })
            .catch(err => {
                alert(`Failed to publish image description: '${err}'`)
            })
    })

    editButton.addEventListener("click", () => {
        resultPage.style.display = "none"
        openComposer(imageHash, language, text, intensityHist)
    })
}

function buildTextDiv(foundText, owned, loggedIn, faved, intensityHistSupplier, backgroundClass) {
    const wrapper = document.createElement("div")
    wrapper.classList.add(backgroundClass)

    const textDiv = document.createElement("div")
    textDiv.classList.add("alt-text-text")
    textDiv.innerText = foundText.text
    wrapper.appendChild(textDiv)

    const controlDiv = document.createElement("div")
    controlDiv.classList.add("alt-text-controls")
    wrapper.appendChild(controlDiv)

    let copied = false
    const copySpan = document.createElement("span")
    copySpan.setAttribute("role", "button")
    copySpan.classList.add("alt-text-left-control", "alt-text-control")
    copySpan.innerHTML = `<img src="images/copy-control.svg" aria-hidden="true" alt="Copy">Copy`
    copySpan.addEventListener("click", async event => {
        if (!copied) {
            apiClient.markAltTextUsed(foundText.imageHash, foundText.userHash, foundText.language)
                .catch(err => {
                    console.log(`Couldn't mark text used: '${err}'`)
                })
        }
        copied = true

        await copyTextToClipboard(foundText.text)
            .then(() => openCopiedModal(event, "Copied!"))
            .catch(() => openCopiedModal(event, "Couldn't copy that text, you'll have to do it manually."))
    })
    controlDiv.appendChild(copySpan)

    if (loggedIn) {
        const editSpan = document.createElement("span")
        editSpan.setAttribute("role", "button")
        editSpan.classList.add("alt-text-left-control", "alt-text-control")
        editSpan.innerHTML = `<img src="images/edit-control.svg" aria-hidden="true" alt="Edit">Edit`
        editSpan.addEventListener("click", () => {
            openComposer(foundText.imageHash, foundText.language, foundText.text, intensityHistSupplier())
        })
        controlDiv.appendChild(editSpan)

        const faveSpan = document.createElement("span")
        faveSpan.setAttribute("role", "button")
        faveSpan.classList.add("alt-text-left-control", "alt-text-control")
        let faveImage = faved ? "fave-faved-control.svg" : "fave-unfaved-control.svg"
        faveSpan.innerHTML = `<img src="images/${faveImage}" aria-hidden="true" alt="Edit">Favorite`
        faveSpan.addEventListener("click", () => {
            faved = !faved
            faveImage = faved ? "fave-faved-control.svg" : "fave-unfaved-control.svg"
            faveSpan.innerHTML = `<img src="images/${faveImage}" aria-hidden="true" alt="Edit">Favorite`
            setFaved(foundText, faved)
        })
        controlDiv.appendChild(faveSpan)

        if (!owned) {
            const reportSpan = document.createElement("span")
            reportSpan.setAttribute("role", "button")
            reportSpan.classList.add("alt-text-report-control alt-text-control")
            reportSpan.innerHTML = `Report<img src="images/report-control.svg" aria-hidden="true" alt="Report">`
            reportSpan.addEventListener("click", () => {
                openReportModal(foundText)
            })
            controlDiv.appendChild(reportSpan)
        }
    }

    return wrapper
}

function openCopiedModal(event, msg) {
    let modalDiv = document.querySelector(".copied-modal")
    modalDiv.innerHTML = msg
    modalDiv.style.left = event.x
    modalDiv.style.top = event.y
    modalDiv.style.display = "block"
    setTimeout(() => modalDiv.style.display = "none", 2000)
}

function openReportModal(altText) {
    let modalDiv = document.querySelector(".report-modal")
    let reportButton = getFreshButton(".submit-report-button")

    let reasonInput = document.querySelector("#report-input")
    reasonInput.value = ""
    reasonInput.addEventListener("input", () => {
        if (reasonInput.value && reasonInput.value.length < 1000) {
            reportButton.classList.remove("button-disabled")
            reportButton.classList.add("button-enabled")
        } else {
            reportButton.classList.remove("button-enabled")
            reportButton.classList.add("button-disabled")
        }
    })

    let reportingText = document.querySelector(".text-to-be-reported")
    reportingText.innerHTML = altText.text

    reportButton.addEventListener("click", () => {
        if (reasonInput.value && reasonInput.value.length < 1000) {
            apiClient.reportAltText(altText.imageHash, altText.userHash, altText.language, reasonInput.value)
        }
    })

    modalDiv.style.display = "block"
}

function search(imageHash, language, intensityHist, url, ocr, loggedIn, originDiv, faves) {
    const loadingDiv = document.querySelector(".loading-anim-wrapper")
    const searchResults = document.querySelector(".search-results")

    if (originDiv) {
        originDiv.style.display = "none"
    }
    loadingDiv.style.display = "block"

    apiClient.getAltText(imageHash, language, intensityHist, url)
        .then(result => {
            setupResultDisplay(imageHash, language, result, ocr, loggedIn, intensityHist, url, faves)
            loadingDiv.style.display = "none"
            searchResults.style.display = "block"
        })
        .catch(err => {
            alert(`Search failed: '${err}'`)

            //This is unfriendly. Maybe try to utilize browser history when it's implemented?
            const postSearch = document.querySelector(".post-search-select")
            const searchWrapper = document.querySelector(".search-box-wrapper")

            postSearch.style.display = "none"
            searchWrapper.style.display = "block"
            loadingDiv.style.display = "none"
        })
}

function openFaveAndOwned(imageHash, language, faved, owned, intensityHistSupplier, url, ocr, loggedIn, faves) {
    const faveWrapper = document.querySelector(".favorite-text-wrapper")
    const faveText = document.querySelector("#favorite-text")
    if (faveText.firstChild) {
        faveText.removeChild(faveText.firstChild)
    }

    const userTextWrapper = document.querySelector(".users-text-wrapper")
    const userText = document.querySelector("#users-text")
    if (userText.firstChild) {
        userText.removeChild(userText.firstChild)
    }

    if (faveText) {
        faveText.appendChild(buildTextDiv(faveText, false, loggedIn, true, intensityHistSupplier, "alt-text-bg-zebra-dark"))
        faveWrapper.style.display = "block"
    }

    if (owned) {
        userText.appendChild(buildTextDiv(userText, true, loggedIn, false, intensityHistSupplier, "alt-text-bg-zebra-dark"))
        userTextWrapper.style.display = "block"
    }

    const searchButton = getFreshButton(".search-after-faves-button")

    searchButton.addEventListener("click", () => {
        search(imageHash, language, intensityHistSupplier(), url, ocr, isUserLoggedIn(), faveWrapper, faves)
    })
}


function setFaved(text, faved) {
    if (faved) {
        apiClient.favoriteAltText(text.imageHash, text.userHash, text.language)
    } else {
        apiClient.unfavoriteAltText(text.imageHash, text.userHash, text.language)
    }
}

function fallbackCopyTextToClipboard(text) {
    let textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let successful;
    try {
        successful = document.execCommand('copy');
    } catch (err) {
        successful = false
    }

    document.body.removeChild(textArea);
    return successful
}

async function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        return fallbackCopyTextToClipboard(text);
    }

    return await navigator.clipboard.writeText(text)
}

function openComposer(imageHash, language, existingText, intensityHist, url) {
    const wrapper = document.querySelector(".composer-wrapper")
    const input = document.querySelector("#composer-textarea")
    const publishPublic = document.querySelector("#publish-public")

    const charCounter = document.querySelector(".composer-char-counter")
    charCounter.innerHTML = `${existingText.length}/1000`

    const publishButton = getFreshButton(".publish-button")

    publishButton.addEventListener("click", () => {
        apiClient.publishAltText(imageHash, language, input.value, intensityHist, url, publishPublic.checked)
            .then(() => {
                openPublished(imageHash, language, input.value, intensityHist, url)
            })
            .catch(err => {
                alert(`Publish failed: '${err}'`)
            })
    })

    wrapper.style.display = "block"
}

function openPublished(imageHash, language, text, intensityHist, url) {
    const publishWrapper = document.querySelector(".published-wrapper")
    const publishedTextWrapper = document.querySelector(".published-text-wrapper")
    publishedTextWrapper.innerHTML = text

    const copyButton = getFreshButton(".published-copy-button")
    copyButton.addEventListener("click", async event => {
        await copyTextToClipboard(text)
            .then(() => openCopiedModal(event, "Copied!"))
            .catch(() => openCopiedModal(event, "Couldn't copy that text, you'll have to do it manually."))
    })

    const editButton = getFreshButton("published-edit-button")
    editButton.addEventListener("click", () => {
        publishWrapper.style.display = "none"
        openComposer(imageHash, language, text, intensityHist, url)
    })
}

function getFreshButton(selector) {
    const original = document.querySelector(selector)
    const copy = original.clone()
    original.replaceWith(copy)
    return copy
}

function getImageBitmapFromFile(fileSearchInput) {
    return () => {
        return AltText.Loaders.getImageBitmapForFile(fileSearchInput.files[0])
    }
}

function getImageBitmapFromUrl(urlSearchInput) {
    return function () {
        return AltText.Loaders.getImageBitmapForUrl(urlSearchInput.value);
    };
}

// UI Setup
(function () {
    const searchBoxWrapper = document.querySelector(".search-box-wrapper")
    const localSearchTab = document.querySelector(".on-computer-search-title")
    const webSearchTab = document.querySelector(".on-the-web-search-title")
    const fileSearchInput = document.querySelector("#file-search-input")
    const urlSearchInput = document.querySelector("#url-search-input")
    const searchButton = document.querySelector(".search-button")
    const fileChosen = document.querySelector('#chosen-file');
    const fileLabel = document.querySelector("#file-search-label")
    const languageSelector = document.querySelector("#language-select")
    const isTextWrapper = document.querySelector(".is-text-wrapper")
    const isTextCheck = document.querySelector("#is-text")

    const postSearch = document.querySelector(".post-search-select")
    const loading = document.querySelector(".loading-anim-wrapper")
    const errorBox = document.querySelector(".error-box")
    const errorMessage = document.querySelector(".error-message")
    const backToSearch = document.querySelector(".back-to-search-button")
    const composerInput = document.querySelector("#composer-textarea")
    const charCounter = document.querySelector(".composer-char-counter")

    let searchEnabled = false
    let ocrEnabled = false
    let requiredThing = "an image file"
    setButtonEnabled(searchButton, false)

    let bitmapFetcher = getImageBitmapFromFile(fileSearchInput)
    localSearchTab.addEventListener("click", () => {
        selectLeft(localSearchTab, webSearchTab)
        fileChosen.style.display = "inline-block"
        fileLabel.style.display = "inline-block"
        urlSearchInput.style.display = "none"
        requiredThing = "an image file"
        isTextWrapper.style.display = "none"

        ocrEnabled = false
        searchEnabled = !!fileChosen.textContent
        setButtonEnabled(searchButton, searchEnabled)
        bitmapFetcher = getImageBitmapFromFile(fileSearchInput)
    })

    fileSearchInput.addEventListener('change', function () {
        fileChosen.textContent = fileSearchInput.files[0].name
        searchEnabled = true
        setButtonEnabled(searchButton, true)
    })

    webSearchTab.addEventListener("click", () => {
        selectRight(localSearchTab, webSearchTab)
        fileChosen.style.display = "none"
        fileLabel.style.display = "none"
        requiredThing = "a web address"

        searchEnabled = validateUrl(urlSearchInput.value);
        ocrEnabled = true
        setButtonEnabled(searchButton, searchEnabled)

        isTextWrapper.style.display = "block"
        urlSearchInput.style.display = "block"
        bitmapFetcher = getImageBitmapFromUrl(urlSearchInput)
    })

    urlSearchInput.addEventListener("change", () => {
        searchEnabled = validateUrl(urlSearchInput.value);
        setButtonEnabled(searchButton, searchEnabled)
    })

    let defaultLang = getUserSetting("defaultLang", "en")
    languages.forEach(language => {
        let option = document.createElement("option")
        option.value = language.code
        option.innerText = language.name

        if (language.code === defaultLang) {
            option.selected = true
        }

        languageSelector.appendChild(option)
    })

    composerInput.addEventListener("input", () => {
        charCounter.innerHTML = `${composerInput.value}/1000`
    })

    searchButton.addEventListener("click", async () => {
        if (!searchEnabled) {
            alert(`You must input ${requiredThing} to search for.`)
            return
        }

        searchBoxWrapper.style.display = "none"
        loading.style.display = "block"
        postSearch.style.display = "grid"

        let bitmap;
        try {
            bitmap = bitmapFetcher()
        } catch (err) {
            if (err.match(/CORS/i)) {
                errorMessage.innerHTML = "The website hosting that image didn't let Alt-Text.org download it. If " +
                    "you’d like to search for that image, please save it and use the 'On Your Computer' option."
            } else {
                errorMessage.innerHTML = `Image search failed: '${err}'`
            }

            loading.style.display = "none"
            errorBox.style.display = "block"
            return
        }

        let url = ocrEnabled ? urlSearchInput.value : null
        let ocr = isTextCheck.checked
        let language = languageSelector.value
        let hash = apiClient.getBitmapHash(bitmap)
        let favesAndUserTexts = await getFavesAndUserTexts(hash, language);
        if (favesAndUserTexts) {
            openFaveAndOwned(hash, language, favesAndUserTexts.favorite, favesAndUserTexts.userText,
                () => apiClient.getIntensityHist(bitmap), url, ocr, isUserLoggedIn(), await favorites)
        } else {
            let intensityHist = apiClient.getIntensityHist(bitmap)
            search(hash, language, intensityHist, url, ocr, isUserLoggedIn(), null, await favorites)
        }
    })

    backToSearch.addEventListener("click", () => {
        errorBox.style.display = "none"
        searchBoxWrapper.style.display = "block"
    })
})();