const urlRegex = new RegExp('^https?://.+', 'iu')

function validateUrl(url) {
    return urlRegex.test(url)
}

function selectLeft(leftTab, rightTab) {
    selectTab(leftTab)
    deselectTab(rightTab)
    rightTab.style.borderRight = "3px var(--misc-grey-color) solid"
}

function selectRight(leftTab, rightTab) {
    selectTab(rightTab)
    deselectTab(leftTab)
    leftTab.style.borderLeft = "3px var(--misc-grey-color) solid"
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
    style.color = "var(--misc-grey-color)"
    style.borderTop = "3px var(--misc-grey-color) solid"
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

// const apiClient = new AltText.Client.AltTextClient()
/*
        getBitmapHash(image: ImageData): string
        getIntensityHist(image: ImageData): string
        getAltText(imageHash: string, language: string, intensityHist?: string, ocrUrl?: string, minConfidence?: number, matches?: number): Promise<IGetAltTextsForImageResponse>
        publishAltText(imageHash: string, language: string, altText: string, intensityHist?: string, url?: URL, isPublic?: string): Promise<void>
        deleteAltText(imageHash: string, language: string): Promise<void>
        getUserAltText(): Promise<IUserAltText[]>
        getUserFavorites(): Promise<IUserFavorite[]>
        favoriteAltText(imageHash: string, userHash: string, language: string): Promise<void>
        unfavoriteAltText(imageHash: string, userHash: string, language: string): Promise<void>
        reportAltText(imageHash: string, userHash: string, language: string, reason: string): Promise<void>
        markAltTextUsed(imageHash: string, userHash: string, language: string): Promise<void>
 */
const realApiClient = new AltText.Client.AltTextClient()
const apiClient = {
    getBitmapHash: realApiClient.getBitmapHash,
    getIntensityHist: realApiClient.getIntensityHist,
    getAltText: (imageHash, language, intensityHist, ocr) => {
        console.log(`fetching: ${imageHash}:${language} URL: '${ocr}'`)
        return Promise.resolve({
            texts: [],
            extractedText: ""
        })
    },
    publishAltText: (imageHash, language, altText, intensityHist, url, isPublic) => {
        console.log(`Publishing: ${imageHash}:${language} URL: '${url}' Public: ${isPublic} Hist: ${intensityHist}`)
        return Promise.resolve()
    },
    getUserFavorites: () => {
        console.log("Returning user favorites")
        return Promise.resolve([])
    },
    getUserAltText: () => {
        console.log("Returning user texts")
        return Promise.resolve([])
    },
    favoriteAltText: (imageHash, userHash, language) => {
        console.log(`Got fave: ${imageHash}:${userHash}:${language}`)
        return Promise.resolve()
    },
    unfavoriteAltText: (imageHash, userHash, language) => {
        console.log(`Got unfave: ${imageHash}:${userHash}:${language}`)
        return Promise.resolve()
    },
    reportAltText: (imageHash, userHash, language, reason) => {
        console.log(`Got report: ${imageHash}:${userHash}:${language}: ${reason}`)
        return Promise.resolve()
    },
    markAltTextUsed: (imageHash, userHash, language) => {
        console.log(`Got mark: ${imageHash}:${userHash}:${language}`)
        return Promise.resolve()
    }
}

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

function openResultDisplay(imageHash, language, result, loggedIn, intensityHist, url, faves) {
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

    const searchResults = document.querySelector(".search-results")
    const openComposerButton = getFreshElement(".result-composer-link")
    setButtonEnabled(openComposerButton, loggedIn)
    if (loggedIn) {
        openComposerButton.innerHTML = "Write&nbsp;Your&nbsp;Own"
        openComposerButton.addEventListener("click", () => {
            searchResults.style.display = "none"
            openComposer(imageHash, language, "", intensityHist, url)
        })
    } else {
        //TODO: Make this open signin page
        openComposerButton.innerHTML = "Sign&nbsp;In&nbsp;To&nbsp;Write&nbsp;Your&nbsp;Own"
    }
    const loading = document.querySelector(".loading-anim-wrapper")
    loading.style.display = "none"
    searchResults.style.display = "block"
}

function changeResultTab(tabToSelect, otherTab1, otherTab2, otherTab3) {
    tabToSelect.style.borderBottom = "none"
    tabToSelect.style.borderLeft = "3px black solid"
    tabToSelect.style.borderRight = "3px black solid"
    tabToSelect.style.borderTop = "3px black solid"
    tabToSelect.style.zIndex = "501"

    if (otherTab1) {
        otherTab1.style.borderBottom = "3px black solid"
        otherTab1.style.borderLeft = "3px var(--misc-grey-color) solid"
        otherTab1.style.borderRight = "3px var(--misc-grey-color) solid"
        otherTab1.style.borderTop = "3px var(--misc-grey-color) solid"
        otherTab1.style.zIndex = "500"
    }

    if (otherTab2) {
        otherTab2.style.borderBottom = "3px black solid"
        otherTab2.style.borderLeft = "3px var(--misc-grey-color) solid"
        otherTab2.style.borderRight = "3px var(--misc-grey-color) solid"
        otherTab2.style.borderTop = "3px var(--misc-grey-color) solid"
        otherTab2.style.zIndex = "500"
    }

    if (otherTab3) {
        otherTab3.style.borderBottom = "3px black solid"
        otherTab3.style.borderLeft = "3px var(--misc-grey-color) solid"
        otherTab3.style.borderRight = "3px var(--misc-grey-color) solid"
        otherTab3.style.borderTop = "3px var(--misc-grey-color) solid"
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
    const saveButton = getFreshElement(".ocr-result-save")
    const editButton = getFreshElement(".ocr-edit-button")

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
    let reportButton = getFreshElement(".submit-report-button")

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

function openNotFound(imageHash, language, intensityHist, url, loggedIn) {
    const notFoundWrapper = document.querySelector(".not-found")
    const backToSearchButton = getFreshElement(".not-found-back-to-search-button")
    const openComposerButton = getFreshElement(".not-found-open-composer-button")

    setButtonEnabled(openComposerButton, loggedIn)
    if (loggedIn) {
        openComposerButton.innerHTML = "Write&nbsp;Your&nbsp;Own"

        openComposerButton.addEventListener("click", () => {
            notFoundWrapper.style.display = "none"
            openComposer(imageHash, language, "", intensityHist, url)
        })
    } else {
        //TODO: Make this open signin page
        openComposerButton.innerHTML = "Sign&nbsp;In&nbsp;To&nbsp;Write&nbsp;Your&nbsp;Own"
    }

    backToSearchButton.addEventListener("click", () => {
        notFoundWrapper.style.display = "none"
        openSearchPortal()
    })

    notFoundWrapper.style.display = "block"
}

function displaySearchedImage(bitmap) {
    const canvas = document.querySelector("#image-canvas")
    // const parent = document.querySelector(".composer-image-wrapper")
    canvas.height = bitmap.height
    canvas.width = bitmap.width

    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(bitmap, 0, 0)

    // const aspectRatio = bitmap.height / bitmap.width
    // canvas.width = parent.clientWidth
    // canvas.height = parent.clientHeight
    //
    // window.addEventListener("resize", () => {
    //     canvas.width = parent.clientWidth
    //     canvas.height = parent.clientHeight
    // })
}

function search(imageHash, language, intensityHist, url, ocr, loggedIn, originDiv, faves) {
    const loadingDiv = document.querySelector(".loading-anim-wrapper")

    if (originDiv) {
        originDiv.style.display = "none"
    }
    loadingDiv.style.display = "block"

    apiClient.getAltText(imageHash, language, intensityHist, url)
        .then(result => {
            if (result.texts.length > 0 || result.extractedText) {
                openResultDisplay(imageHash, language, result, ocr, loggedIn, intensityHist, url, faves)
            } else {
                loadingDiv.style.display = "none"
                openNotFound(imageHash, language, intensityHist, url, loggedIn)
            }
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

    const searchButton = getFreshElement(".search-after-faves-button")

    searchButton.addEventListener("click", () => {
        search(imageHash, language, intensityHistSupplier(), url, ocr, isUserLoggedIn(), faveWrapper, faves)
    })
}


function setFaved(text, faved) {
    if (faved) {
        apiClient.favoriteAltText(text.imageHash, text.userHash, text.language)
            .then(async () => {
                let faves = await favorites
                if (!faves[text.imageHash]) {
                    faves[text.imageHash] = {}
                }

                faves[text.imageHash][text.language] = {
                    text: text.text,
                    imageHash: text.imageHash,
                    userHash: text.userHash,
                    language: text.language
                }
            })
            .catch(err => {
                console.log(`Failed to fave alt text: ${err}`)
            })
    } else {
        apiClient.unfavoriteAltText(text.imageHash, text.userHash, text.language)
            .then(async () => {
                let faves = await favorites
                if (!faves[text.imageHash]) {
                    return
                }

                delete faves[text.imageHash][text.language]
            })
            .catch(err => {
                console.log(`Failed to unfave alt text: ${err}`)
            })
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
    const input = getFreshElement("#composer-textarea")
    const publishPublic = document.querySelector("#publish-public")
    const composerInput = getFreshElement("#composer-textarea")

    const charCounter = document.querySelector(".composer-char-counter")
    charCounter.innerHTML = `${existingText.length}/1000`

    const publishButton = getFreshElement(".publish-button")
    setButtonEnabled(publishButton, 0 < existingText.length && existingText.length < 1000)

    composerInput.addEventListener("input", () => {
        setButtonEnabled(publishButton, 0 < composerInput.value.length && composerInput.value.length < 1000)
        charCounter.innerHTML = `${composerInput.value}/1000`
    })

    publishButton.addEventListener("click", () => {
        if (0 === composerInput.value.length || composerInput.value.length > 1000) {
            return
        }

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

    const copyButton = getFreshElement(".published-copy-button")
    copyButton.addEventListener("click", async event => {
        await copyTextToClipboard(text)
            .then(() => openCopiedModal(event, "Copied!"))
            .catch(() => openCopiedModal(event, "Couldn't copy that text, you'll have to do it manually."))
    })

    const editButton = getFreshElement("published-edit-button")
    editButton.addEventListener("click", () => {
        publishWrapper.style.display = "none"
        openComposer(imageHash, language, text, intensityHist, url)
    })
}

function getFreshElement(selector) {
    const original = document.querySelector(selector)
    const copy = original.cloneNode(true)
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

function openSearchPortal() {
    const searchBoxWrapper = document.querySelector(".search-box-wrapper")
    const localSearchTab = document.querySelector(".on-computer-search-title")
    const webSearchTab = document.querySelector(".on-the-web-search-title")
    const fileChosen = document.querySelector('#chosen-file');
    const fileLabel = document.querySelector("#file-search-label")
    const isTextWrapper = document.querySelector(".is-text-wrapper")
    const urlSearchInput = getFreshElement("#url-search-input")
    const fileSearchInput = getFreshElement("#file-search-input")
    const searchButton = getFreshElement(".search-button")

    const languageSelector = getFreshElement("#language-select")
    const isTextCheck = getFreshElement("#is-text")

    const postSearch = document.querySelector(".post-search-select")
    const backToSearchFromImageButton = getFreshElement(".search-another-image-button")
    const loading = document.querySelector(".loading-anim-wrapper")


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

        isTextWrapper.style.display = "flex"
        urlSearchInput.style.display = "block"
        bitmapFetcher = getImageBitmapFromUrl(urlSearchInput)
    })

    urlSearchInput.addEventListener("input", () => {
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

    searchButton.addEventListener("click", async () => {
        if (!searchEnabled) {
            alert(`You must input ${requiredThing} to search for.`)
            return
        }

        let bitmap;
        try {
            bitmap = await bitmapFetcher()
        } catch (err) {
            let message;
            if (err.match(/CORS/i)) {
                message = "The website hosting that image didn't let Alt-Text.org download it. If " +
                    "you’d like to search for that image, please save it and use the 'On Your Computer' option."
            } else {
                message = `Image search failed: '${err}'`
            }

            loading.style.display = "none"
            openErrorDisplay(message)
            return
        }

        displaySearchedImage(bitmap)
        backToSearchFromImageButton.addEventListener("click", () => {
            postSearch.style.display = "none"
            searchBoxWrapper.style.display = "block"
        })

        searchBoxWrapper.style.display = "none"
        loading.style.display = "block"
        postSearch.style.display = "grid"

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
}

function openErrorDisplay(message) {
    const backToSearch = document.querySelector(".back-to-search-button")
    const errorBox = document.querySelector(".error-box")
    const errorMessage = document.querySelector(".error-message")

    errorMessage.innerHTML = message
    errorBox.style.display = "block"

    backToSearch.addEventListener("click", () => {
        errorBox.style.display = "none"
        openSearchPortal()
    })
}

openSearchPortal()
