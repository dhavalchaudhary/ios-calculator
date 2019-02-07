import React, { Component } from "react";
import "./App.css";
import Calculator from "./Calculator";
import styled from "@emotion/styled";

const Page = styled.div`
  min-height: 100vh;
  height: 100%;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class App extends Component {
  render() {
    return (
      <Page>
        <Calculator />
      </Page>
    );
  }
}

export default App;
