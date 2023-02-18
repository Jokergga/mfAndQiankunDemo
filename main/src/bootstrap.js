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

// if (module.hot) {
//   module.hot.accept(["./App"], () => {
//     // ReactDOM.render(<App />, document.getElementById('root'));
//     const root = ReactDOM.createRoot(document.getElementById("root"));
//     root.render(
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     );
//   });
// }

registerMicroApps([
  // {
  //   name: "micro-app-one",
  //   entry: "//localhost:10000/micro-app-one",
  //   container: "#container",
  //   activeRule: "/micro-app-one",
  // },
  // {
  //   name: "slave12",
  //   entry: "http://localhost:8002",
  //   container: "#container",
  //   activeRule: "/slave1",
  // },
  // {
  //   name: "umi-app2",
  //   entry: "//localhost:4002",
  //   container: "#container",
  //   activeRule: "/@example/zebras-mf-app2",
  // },
  {
    name: "app-bar",
    entry: "//localhost:9000",
    container: "#container",
    activeRule: "/app-bar",
  },
  {
    name: "app-foo",
    entry: "//localhost:9001",
    container: "#container",
    activeRule: "/app-foo",
  },
  // {
  //   name: "components",
  //   entry: "//localhost:9002",
  //   container: "#container",
  //   activeRule: "/components",
  // },
]);
// 启动 qiankun
start({
  sandbox: { strictStyleIsolation: true },
  // sandbox: false,
});
