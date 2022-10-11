import React, { useState } from "react";
import { report } from "../actions/api.js";

export default function ReportModal(props) {
  const { close, handleReportSuccess } = props;
  const [reason, setReason] = useState("");

  const author = props.reportModalContent?.author;
  const sha = props.reportModalContent?.sha;
  const language = props.reportModalContent?.language;
  const altText = props.reportModalContent?.altText;

  const submitReport = () => {
    if (author && sha && language && altText) {
      report(author, sha, language, reason, () => {
        props.close();
        props.handleReportSuccess();
      });
    } else {
      props.close();
    }
  };

  const updateReason = (event) => {
    setReason(event.target.value);
  };

  return (
    <div className="report-modal">
      <div className="report-modal-inner-wrapper">
        <div className="report-modal-title-bar">Report Alt Text</div>
        <div className="report-modal-alt-text-wrapper">
          <div className="report-modal-alt-text">{altText}</div>
        </div>
        <hr className="report-modal-hr" />
        <div className="report-modal-text-label">
          <label htmlFor="report-modal-reason">Report Reason</label>
        </div>
        <div className="report-modal-reason-wrapper">
          <textarea
            className="report-modal-reason"
            name="report-modal-reason"
            placeholder="Why are you reporting this description? (1000 characters max)"
            maxLength="1000"
            rows="5"
            value={reason}
            onChange={updateReason}
          />
        </div>
        <div className="report-modal-controls">
          <button
            className="report-modal-close-ctrl std-button"
            onClick={() => close()}
          >
            Cancel
          </button>
          <button
            className="report-modal-submit-ctrl std-button"
            onClick={submitReport}
          >
            Submit Report
          </button>
        </div>
      </div>
      <div className="report-modal-mask" onClick={() => close()}></div>
    </div>
  );
}
