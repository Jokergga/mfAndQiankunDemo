import React from "react";
// const RemoteButton = React.lazy(() => import("remote/Button"));
import './utils/init-common'

const App = () => (
  <div>
    <h1>Basic Host-Remote</h1>
    <React.Suspense fallback="Loading Button">
      {/* <RemoteButton /> */}
    </React.Suspense>
  </div>
);

export default App;