import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Main from "../views/main";
import SignUp from "../views/sign-up";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
          <Route path="/www.alt-text.org/public/index.html" element={<Main />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
