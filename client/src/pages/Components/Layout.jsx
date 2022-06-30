import React from "react";

import logo from "../../img/logo.png";

export default function Layout(props) {
  return (
    <div id="pageLayout">
      <nav className="navbar navbar-expand-lg navbar-dark p-4 m-2">
        <div className="d-flex justify-content-between">
          <img src={logo} alt="" className="logo" />
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          ></button>
        </div>
      </nav>
      {props.msg === "alignChildrenCenter" ? (
        <div className="d-flex mt-5 justify-content-center align-items-center">
          {props.children}
        </div>
      ) : (
        <>{props.children}</>
      )}
    </div>
  );
}
