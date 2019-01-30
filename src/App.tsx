import React, { Component } from "react";
import "./App.css";
import Calculator from "./Calculator";

class App extends Component {
  render() {
    return (
      <div className="App">
        <h3>Simplified IOS Calculator</h3>
        <Calculator />
      </div>
    );
  }
}

export default App;
