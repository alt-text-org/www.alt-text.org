function searchLocal() {
    return Promise.resolve([])
}

function searchWeb() {
    return Promise.resolve([])
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

(function () {
    let searchBoxWrapper = document.querySelector(".search-box-wrapper")
    let localSearchTab = document.querySelector(".on-computer-search-title")
    let webSearchTab = document.querySelector(".on-the-web-search-title")
    let fileSearchInput = document.querySelector("#file-search-input")
    let urlSearchInput = document.querySelector("#url-search-input")
    let searchButton = document.querySelector(".search-button")

    let loading = document.querySelector(".loading-anim")
    let searchResults = document.querySelector(".search-results")
    let notFound = document.querySelector(".not-found")
    let errorBox = document.querySelector(".error-box")
    let errorMessage = document.querySelector(".error-message")
    let backToSearch = document.querySelector(".back-to-search-button")

    let searchFunction = searchLocal
    localSearchTab.addEventListener("click", () => {
        selectLeft(localSearchTab, webSearchTab)
        fileSearchInput.style.display = "block"
        urlSearchInput.style.display = "none"
        searchFunction = searchLocal
    })

    webSearchTab.addEventListener("click", () => {
        selectRight(localSearchTab, webSearchTab)
        fileSearchInput.style.display = "none"
        urlSearchInput.style.display = "block"
        searchFunction = searchWeb
    })

    searchButton.addEventListener("click", () => {
        searchBoxWrapper.style.display = "none"
        loading.style.display = "block"

        searchFunction()
            .then(results => {
                if (results.length > 0) {
                    // Build result
                    loading.style.display = "none"
                    searchResults.style.display = "block"
                } else {
                    loading.style.display = "none"
                    notFound.style.display = "block"
                }
            })
            .catch(err => {
                if (err.match(/CORS/i)) {
                    errorMessage.innerHTML = "The website hosting that image didn't let Alt-Text.org download it. If " +
                        "you’d like to search for that image, please save it and use the 'On Your Computer' option."
                } else {
                    errorMessage.innerHTML = `Image search failed: '${err}'`
                }

                loading.style.display = "none"
                errorBox.style.display = "block"
            })
    })

    backToSearch.addEventListener("click", () => {
        errorBox.style.display = "none"
        searchBoxWrapper.style.display = "block"
    })
})();