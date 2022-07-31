import React from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from 'react-helmet-async';
import App from "./app.jsx";
import AltTextOrgClient from "./alt-text-org";

const altTextOrgClient = new AltTextOrgClient(/*import("opencv-wasm")*/)

ReactDOM.render(
    <React.StrictMode>
        <HelmetProvider>
            <App altTextOrgClient={altTextOrgClient} />
        </HelmetProvider>
    </React.StrictMode>,
    document.getElementById("root")
);