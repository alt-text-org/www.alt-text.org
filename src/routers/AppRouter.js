import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AltTextOrgFooter from "../components/footer";

import Main from "../views/main";

function AppRouter(props) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
      <AltTextOrgFooter />
    </Router>
  );
}

export default AppRouter;
