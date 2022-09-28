import * as React from 'react';
import {NavLink} from "react-router-dom";

export default function AltTextOrgHeader() {
    return <div className="header-wrapper">
                <div className='header-s1'>
                <a href="/"><h1 className="site-title">Alt-Text.org</h1></a>
                </div>
                <div className='header-s2'>
                    <NavLink className="std-button header-sign-up-button" to={'/sign-up'}>
                        Help Fill The Library
                    </NavLink>
                </div>
            </div>
}