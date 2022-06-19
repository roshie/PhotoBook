import React from "react";
import { Link } from "react-router-dom";

import logo from "../img/logo.png";

export default function Layout(props) {
  return (
    <>
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
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          {/* <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" href="#">About us</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" href="#">Portfolio</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" href="#">Contact</a>
                            </li>
                        </ul>
                    </div> */}
        </div>
      </nav>
      {props.msg == "alignChildrenCenter" ? (
        <div className="d-flex mt-5 justify-content-center align-items-center">
          {props.children}
        </div>
      ) : (
        <>{props.children}</>
      )}
      <div className="ele"></div>
    </>
  );
}
