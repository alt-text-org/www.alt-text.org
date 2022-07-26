import * as React from 'react';

export default function ErrorPage(props) {
    return <div className="error-box">
        <div className="error-message">{props.error}</div>
        <div className="error-button-wrapper">
            <button onClick={props.returnToSearch}>Return To Search</button>
        </div>
    </div>
}