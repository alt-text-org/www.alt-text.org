import * as React from 'react';

export default function AltTextOrgHeader() {
    return <div className="header-wrapper">
                <div class='header-s1'>
                <a href="/"><h1 className="site-title">Alt-Text.org</h1></a>
                </div>
                <div class='header-s2'>
                    <button className="std-button header-sign-up-button" onClick={() => document.location.href='/sign-up.html'}>
                        Help Fill The Library
                    </button>
                </div>
            </div>
}