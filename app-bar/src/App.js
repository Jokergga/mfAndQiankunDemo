import React from "react";
const RemoteButton = React.lazy(() => import("remote/Button"));
// const RemoteButton1 = React.lazy(() => import("components/Button"));
import './utils/init-common'

const App = () => (
  <div>
    <h1>Basic Host-Remote</h1>
    <h2>Host</h2>
    <React.Suspense fallback="Loading Button">
      <RemoteButton />
      {/* <RemoteButton1 /> */}
    </React.Suspense>
  </div>
);

export default App;