import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Ensure App file extension matches (.jsx or .js)
import "./style/global.css"; // Importing global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
