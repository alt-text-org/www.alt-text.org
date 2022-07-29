import * as React from 'react';

export default function ErrorPage(props) {
    const { returnToSearch, error } = props

    return <div className="error-box">
        <div className="error-title">Error</div>
        <div className="error-message">{error}</div>
        <button className="std-button" onClick={returnToSearch}>Return To Search</button>
    </div>
}