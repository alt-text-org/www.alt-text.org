import * as React from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import AppRouter from "./routers/AppRouter";
import "./styles/styles.scss";

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <AppRouter />
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
