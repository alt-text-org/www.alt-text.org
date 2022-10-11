import * as React from "react";
import { NavLink } from "react-router-dom";

export default function Header(props) {
  return (
    <div className="header">
      <div
        className="header-item logo"
        style={{ cursor: "pointer" }}
        onClick={() => props.startOver()}
      >
        Alt-Text.org
      </div>

      <div className="header-item action">
        <NavLink className="button" to={"/sign-up"}>
          Help Fill The Library
        </NavLink>
      </div>
    </div>
  );
}
