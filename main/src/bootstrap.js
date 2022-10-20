import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { registerMicroApps, start } from "./qiankun/index";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

registerMicroApps([
  {
    name: "umi-slave",
    entry: "//localhost:7002",
    container: "#container",
    activeRule: "/@example/qiankun-slave-app2",
  },
  {
    name: "umi-app2",
    entry: "//localhost:4002",
    container: "#container",
    activeRule: "/@example/zebras-mf-app2",
  },
  {
    name: "app-bar",
    entry: "//localhost:8000",
    container: "#container",
    activeRule: "/app-bar",
  },
  {
    name: "app-foo",
    entry: "//localhost:8001",
    container: "#container",
    activeRule: "/app-foo",
  },
  {
    name: "components",
    entry: "//localhost:8002",
    container: "#container",
    activeRule: "/components",
  },
]);
// 启动 qiankun
start({
  sandbox: { strictStyleIsolation: true },
  // sandbox: false,
});
