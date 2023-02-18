import React from "react";
import App from "./App";
import "./public-path";
import { createRoot } from "react-dom/client";

let root;

export function render(props) {
  const { container } = props;
  root = createRoot(
    container
      ? container.querySelector("#root")  
      : document.querySelector("#root")
  );

  root.render(<App />);
}

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

export async function destroy(props) {
  const { container } = props;
  const root = createRoot(
    container
      ? container.querySelector("#root")
      : document.querySelector("#root")
  );
  root.unmount();
}
