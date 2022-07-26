import * as React from 'react';

export default function Searching(props) {
    const {
        searchFile,
        searchUrl,
        altTextOrgClient,
        displayResults,
        displayError
    } = props

    if (searchFile) {
        altTextOrgClient.searchFile(searchFile)
            .then(results => displayResults(results))
            .catch(err => displayError(err.message))
    } else if (searchUrl) {
        altTextOrgClient.searchUrl(searchUrl)
            .then(results => displayResults(results))
            .catch(err => displayError(err.message))
    } else {
        displayError("Internal error: No search image specified. Please try again.")
        return ""
    }

    return <div className="searching-wrapper">
        <div className="searching-anim-wrapper">
            <img className="searching-anim" alt="searching animation" src="images/searching.svg"/>
        </div>
        <div className="searching-text">Searching</div>
    </div>
}