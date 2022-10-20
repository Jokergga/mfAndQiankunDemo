import("./bootstrap");

// import "./public-path";
// import React from "react";
// import App from "./App";

// import { createRoot } from "react-dom/client";

// let root;

// function render(props) {
//   const { container } = props;

//   root = createRoot(
//     container
//       ? container.querySelector("#root")
//       : document.querySelector("#root")
//   );

//   root.render(<App />);
// }

// if (!window.__POWERED_BY_QIANKUN__) {
//   render({});
// }

// export async function bootstrap() {
//   console.log("[react16] react app bootstraped");
// }

// export async function mount(props) {
//   console.log("[react16] props from main framework", props);
//   render(props);
// }

// export async function unmount(props) {
//   // const { container } = props;

//   // const root = createRoot(
//   //   container
//   //     ? container.querySelector("#root")
//   //     : document.querySelector("#root")
//   // );
//   root.unmount();
// }

// /**
//  * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
//  */
// export async function update(props) {
//   console.log("update props", props);
// }
