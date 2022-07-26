import React from "react";
import ReactDOM from "react-dom";
import App from "./app.jsx";
import { HelmetProvider } from 'react-helmet-async';
import AltTextOrgClient from "./alt-text-org";

const altTextOrgClient = new AltTextOrgClient()

ReactDOM.render(
    <React.StrictMode>
        <HelmetProvider>
            <App altTextOrgClient={altTextOrgClient} />
        </HelmetProvider>
    </React.StrictMode>,
    document.getElementById("root")
);