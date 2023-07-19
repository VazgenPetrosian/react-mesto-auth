import logo from "../images/logo.svg";
import React from "react";

function Header() {
  return (
    <header className="header">
      <img className="logo" src={logo} alt="Лого" />
    </header>
  );
}

export default Header;
