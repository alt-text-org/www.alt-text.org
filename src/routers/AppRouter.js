import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AltTextOrgHeader from "../components/header";
import AltTextOrgFooter from "../components/footer";

import Main from "../views/main";

function AppRouter(props) {
  return (
    <Router>
      <AltTextOrgHeader />
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
      <AltTextOrgFooter />
    </Router>
  );
}

export default AppRouter;
