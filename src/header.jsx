import * as React from 'react';

export default function AltTextOrgHeader() {
    return <div className="header-wrapper">
        <span className="header-contents">
            <a className="site-title" href="https://alt-text.org">Alt-Text.org</a>
            <button className="std-button header-sign-up-button" onClick={() => document.location.href='/sign-up.html'}>
                Help Fill The Library
            </button>
        </span>
    </div>
}