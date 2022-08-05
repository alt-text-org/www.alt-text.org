import * as React from 'react';
import SearchResult from "./search-result";

export default function SearchResults(props) {
    const {
        results, fileDataUrl, searchUrl, openReportModal, copy, returnToSearch
    } = props

    const resultArray = []
    let bg = true;

    if (results && (results.exact.length + results.fuzzy.length > 0 || results.ocr)) {
        if (results.ocr) {
            resultArray.push(<SearchResult
                altText={results.ocr}
                score="Extracted Text"
                report={null}
                copy={() => copy(results.ocr)}
                bgClass={bg ? "result-zebra-dark" : "result-zebra-light"}
            />)
            resultArray.push(<hr className="result-hr"/>)
            bg = !bg
        }

        results.exact.forEach(result => {
            resultArray.push(<SearchResult
                altText={result.alt_text}
                score="Exact Match"
                report={() => openReportModal(result.author_uuid, result.sha256, result.language, result.alt_text)}
                copy={() => copy(result.alt_text)}
                bgClass={bg ? "result-zebra-dark" : "result-zebra-light"}
            />)
            resultArray.push(<hr className="result-hr"/>)
            bg = !bg
        })

        results.fuzzy.forEach(result => {
            if (result.score >= 0.98) {
                resultArray.push(<SearchResult
                    altText={result.alt_text}
                    score={`${Math.floor((result.score - 0.9) * 1000)}% Match`}
                    report={() => openReportModal(result.author_uuid, result.sha256, result.language, result.alt_text)}
                    copy={() => copy(result.alt_text)}
                    bgClass={bg ? "result-zebra-dark" : "result-zebra-light"}
                />)
                resultArray.push(<hr className="result-hr"/>)
                bg = !bg
            }
        })

        if (resultArray.length > 0) {
            resultArray.pop() // pull off last <hr/>

            //These are in a weird order to put the image at the end for screen reader users.
            return <div className="result-outer-wrapper">
            <span className="result-right-wrapper">
                <div className="result-inner-wrapper">
                    {resultArray}
                </div>
            </span>
                <span className="result-left-wrapper">
                <div className="result-image-wrapper">
                    <img className="searched-image" alt="The searched image"
                         src={fileDataUrl ? fileDataUrl : searchUrl}/>
                </div>
                <div className="return-button-wrapper">
                    <button className="std-button" onClick={returnToSearch}>Search Another Image</button>
                </div>
            </span>
                <span className="result-divider"></span>
            </div>
        }
    }

    return <div className="not-found-wrapper">
        <img className="searched-image" alt="The searched image" src={fileDataUrl ? fileDataUrl : searchUrl}/>
        <div className="not-found-message">
            Couldn't find any published alt text for that image.
        </div>
        <div className="not-found-controls">
            <button className="not-found-button std-button" onClick={returnToSearch}>Search Another Image</button>
        </div>
    </div>
}