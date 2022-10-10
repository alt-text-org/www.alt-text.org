import * as React from "react";

import { MdReportProblem, MdContentCopy } from "react-icons/md";

export default function SearchResult(props) {
  const { altText, score, copyText, report, bgClass, openReportModal } = props;

  console.log(altText);

  return (
    <div className="search-result">
      <div className="alt-text-score">
        <p>{score}</p>
      </div>
      <div className="alt-text-text">
        <h2>{altText}</h2>
      </div>
      <div className="alt-text-controls">
        <div className="alt-text-control">
          {report && (
            <button onClick={openReportModal}>
              <MdReportProblem />
              Report
            </button>
          )}
        </div>

        <div className="alt-text-control">
          <button onClick={copyText}>
            <MdContentCopy />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
