import * as React from 'react';
import SearchResult from "./search-result";

export default function SearchResults(props) {
    const {
        results,
        fileDataUrl,
        searchUrl,
        openReportModal,
        copy,
        report,
        returnToSearch
    } = props

    const resultArray = []
    let bg = true;

    if (results) {
        results.exact.forEach(result => {
            resultArray.push(
                <SearchResult
                    altText={result.alt_text}
                    score="Exact Match"
                    report={() => openReportModal(result.author_uuid, result.sha256, result.language)}
                    copy={() => copy(result.alt_text)}
                    bgClass={bg ? "result-zebra-dark" : "result-zebra-light"}
                />
            )
            bg = !bg
        })

        results.fuzzy.forEach(result => {
            resultArray.push(
                <SearchResult
                    altText={result.alt_text}
                    score={`${Math.floor(result.score * 100)}% Match`}
                    report={report}
                    copy={() => copy(result.alt_text)}
                    bgClass={bg ? "result-zebra-dark" : "result-zebra-light"}
                />
            )
            bg = !bg
        })

        return <div className={"result-outer-wrapper"}>
        <span className="result-left-wrapper">
            <div className="result-image-wrapper">
                <img alt="The searched image" src={fileDataUrl ? fileDataUrl : searchUrl}/>
            </div>
            <div className="return-button-wrapper">
                <button onClick={returnToSearch}>Search Another Image</button>
            </div>
        </span>
            <span className="result-divider"></span>
            <span className="result-right-wrapper">
            <div className="result-inner-wrapper">
                {resultArray}
            </div>
        </span>
        </div>
    } else {
        return <div className="not-found">
            <div className="not-found-wrapper">
                <div className="not-found-message">
                    Couldn't find any published alt text for that image.
                </div>
                <div className="not-found-controls">
                    <button onClick={returnToSearch}>Search Another Image</button>
                </div>
            </div>
        </div>
    }
}