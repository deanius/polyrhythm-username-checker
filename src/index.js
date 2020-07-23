import React from "react";
import { render } from "react-dom";
import "./index.scss";
import { UsernameField, UsernameStatus } from "./Username";
import { filter, log, reset } from "polyrhythm";
reset();

filter(true, log);

const UI = () => {
  return (
    <div>
      <h1>Username Availability Checker</h1>
      <UsernameField />
      <UsernameStatus />
    </div>
  );
};

render(<UI />, document.getElementById("app"));
