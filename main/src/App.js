import "./App.css";
import React from "react";
import { Link } from "react-router-dom";
// @ts-ignore
// const RemoteButton = React.lazy(() => import("remote/Button"));

const sideData = [
  "app-foo",
  "app-bar",
  "components",
  "slave1",
  "micro-app-one",
  // "/@example/qiankun-slave-app2",
  // "/@example/zebras-mf-app2",
];

function App() {
  return (
    <div className="main-app">
      <div className="main-side">
        {sideData.map((item) => (
          <div key={item} className="menu-item">
            <Link to={item}>{item}</Link>
          </div>
        ))}
      </div>
      <div className="main-content">
        {/* <h1>main</h1> */}
        <div id="container"></div>
      </div>
    </div>
  );
}

export default App;
