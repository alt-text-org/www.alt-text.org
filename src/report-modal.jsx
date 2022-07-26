import * as React from 'react';

export default function ReportModal(props) {
    const {
        altText,
        report,
        closeModal
    } = props
    const [reason, setReason] = React.useState("");

    const submitReport = () => {
        report(reason)
    }

    const updateReason = (event) => {
        setReason(event.target.value)
    }

    return <div className="report-modal">
        <div className="report-modal-underlay" onClick={closeModal}></div>
        <div className="report-modal-inner-wrapper">
            <div className="report-modal-alt-text">
                {altText}
            </div>
            <div>
                <label className="report-modal-text-label">Report Reason</label>
            </div>
            <div>
                <textarea name="report-modal-reason" value={reason} onChange={updateReason}/>
            </div>
            <div className="report-modal-controls">
                <button onClick={closeModal}>Cancel</button>
                <button onClick={submitReport}>Submit Report</button>
            </div>
        </div>
    </div>
}