import * as React from "react";

import { MdReportProblem, MdContentCopy } from "react-icons/md";

export default function SearchResult(props) {
  const { altText, score, report, openReportModal } = props;

  const copyText = async (text) => {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(text);
    } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = text;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      return new Promise((res, rej) => {
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
      });
    }
  };

  return (
    <div className="search-result">
      <div className="alt-text-score">
        <p>{score}</p>
      </div>
      <div className="alt-text-text">
        <h3>{altText}</h3>
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
          <button onClick={() => copyText(props.altText)}>
            <MdContentCopy />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
