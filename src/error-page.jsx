import * as React from 'react';

export default function ErrorPage(props) {
    const { returnToSearch, error } = props

    return <div className="error-box">
        <div className="error-message">{error}</div>
        <div className="error-button-wrapper">
            <button onClick={returnToSearch}>Return To Search</button>
        </div>
    </div>
}