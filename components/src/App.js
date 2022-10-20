import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Button from "./Button";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>components</p>
        <Button />
      </header>
    </div>
  );
}

export default App;
