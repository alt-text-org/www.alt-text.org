import * as React from "react";
import { NavLink } from "react-router-dom";

export default function Header(props) {
  return (
    <div className="header">
      <NavLink
        className="header-item logo"
        onClick={() => props.startOver()}
        to="/"
      >
        Alt-Text.org
      </NavLink>

      <div className="header-item action">
        <NavLink className="button" to={"/sign-up"}>
          Help Fill The Library
        </NavLink>
      </div>
    </div>
  );
}
