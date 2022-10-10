import * as React from "react";
import { NavLink } from "react-router-dom";

export default function AltTextOrgHeader() {
  return (
    <div className="header">
      <div className="header-item logo">
        <NavLink className="logo" to={"/"}>
          Alt-Text.org
        </NavLink>
      </div>

      <div className="header-item action">
        <NavLink className="button" to={"/sign-up"}>
          Help Fill The Library
        </NavLink>
      </div>
    </div>
  );
}
