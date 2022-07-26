import * as React from 'react';

export default function SearchResult(props) {
    const {
        altText,
        score,
        report,
        copy,
        bgClass
    } = props

    return <div className={"search-result-wrapper " + bgClass}>
        <div className="search-result">
            <div className="alt-text-score">{score}</div>
            <div className="alt-text-text">{altText}</div>
            <div className="alt-text-controls">
            <span className="alt-text-left-controls">
                <button onClick={() => report()}>
                    <img className="alt-text-control" alt="Report" src="images/report-control.svg"/>
                </button>
            </span>
                <span className="alt-text-right-controls">
                <button onClick={() => copy()}>
                    <img className="alt-text-control" alt="Copy" src="images/copy-control.svg"/>
                </button>
            </span>
            </div>
        </div>
    </div>
}