import * as React from 'react';
import SearchResult from "./search-result";

export default function SearchResults(props) {
    const {
        results,
        fileBase64,
        searchUrl,
        report,
        copy,
        returnToSearch
    } = props

    const resultArray = []
    let bg = true;

    results.exact.forEach(result => {
        resultArray.push(
            <SearchResult
                altText={result.alt_text}
                score="Exact Match"
                report={report}
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
                <img alt="The searched image" src={fileBase64 ? fileBase64 : searchUrl}/>
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
}