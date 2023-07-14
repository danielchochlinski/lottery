import React from "react";
import "./App.scss";
import MainTemplate from "./template/MainTemplate";
import MainView from "./views/MainView/MainView";

function App() {
  return (
    <div className="App">
      <MainTemplate>
        <MainView />
      </MainTemplate>
    </div>
  );
}

export default App;
