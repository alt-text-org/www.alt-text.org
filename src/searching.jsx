import * as React from 'react';

export default function Searching(props) {
    const {
        searchFile,
        searchUrl,
        searchType,
        altTextOrgClient,
        displayResults,
        displayError
    } = props

    React.useEffect(() => {
        if (searchType === "file") {
            altTextOrgClient.searchFile(searchFile)
                .then(results => {
                    if (results) {
                        displayResults(results)
                    } else {
                        displayError("Failed to generate searchables!")
                    }
                })
                .catch(err => displayError(err.message))
        } else if (searchType === "url") {
            altTextOrgClient.searchUrl(searchUrl)
                .then(results => {
                    if (results) {
                        displayResults(results)
                    } else {
                        displayError("Failed to generate searchables!")
                    }
                })
                .catch(err => displayError(err.message))
        }
    }, [searchFile, searchUrl])

    return <div className="searching-wrapper">
        <div className="searching-anim-wrapper">
            <img className="searching-anim" alt="searching animation" src="images/searching.svg"/>
        </div>
        <div className="searching-text">Searching</div>
    </div>
}