import * as React from "react";
import ReactDOM from "react-dom";
import {HelmetProvider} from 'react-helmet-async';
import App from "./app.jsx";
import {BrowserRouter} from "react-router-dom";


ReactDOM.render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>,
    document.getElementById("root")
)
;