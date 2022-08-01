import * as React from 'react';

export default function SearchResult(props) {
    const {
        altText, score, copy, report, bgClass
    } = props

    return <div className={"search-result-wrapper " + bgClass}>
        <div className="search-result">
            <div className="alt-text-score">{score}</div>
            <div className="alt-text-text">{altText}</div>
            <div className="alt-text-controls">
                <span className="alt-text-left-controls">
                    <button className="alt-text-control" onClick={report}>
                        <img className="alt-text-control-img" alt="" src="images/report-control.svg"/>
                        Report
                    </button>
                </span>
                <span className="alt-text-right-controls">
                    <button className="alt-text-control" onClick={copy}>
                        <img className="alt-text-control-img" alt="" src="images/copy-control.svg"/>
                        Copy
                    </button>
                </span>
            </div>
        </div>
    </div>
}
