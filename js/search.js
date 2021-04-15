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
    style.borderBottom = "hidden"
    style.borderRight = "3px black solid"
    style.borderLeft = "3px black solid"
    style.borderTop = "3px black solid"
    style.zIndex = "501"
}

function deselectTab(tab) {
    let style = tab.style;
    style.borderTop = "3px #AAAAAA solid"
    style.borderBottom = "3px black solid"
    style.zIndex = "500"
}

(function () {
    let localSearchTab = document.querySelector(".on-computer-search-title")
    let webSearchTab = document.querySelector(".on-the-web-search-title")
    let fileSearchInput = document.querySelector("#file-search-input")
    let urlSearchInput = document.querySelector("#url-search-input")

    localSearchTab.addEventListener("click", () => {
        selectLeft(localSearchTab, webSearchTab)
        fileSearchInput.style.display = "block"
        urlSearchInput.style.display = "none"
    })

    webSearchTab.addEventListener("click", () => {
        selectRight(localSearchTab, webSearchTab)
        fileSearchInput.style.display = "none"
        urlSearchInput.style.display = "block"
    })
})();