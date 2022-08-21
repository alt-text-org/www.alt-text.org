import React from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from 'react-helmet-async';
import App from "./app.jsx";


ReactDOM.render(
    <React.StrictMode>
        <HelmetProvider>
            <App/>
        </HelmetProvider>
    </React.StrictMode>,
    document.getElementById("root")
);