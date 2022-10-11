import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Main from "../views/main";
import SignUp from "../views/sign-up";

function AppRouter(props) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
