export const BASE_SandboxFiles = {
  "/App.js": {
    code: `import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>React Sandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  );
}`
  },
  "/index.js": {
    code: `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`
  },
  "/public/index.html": {
    code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
  },
  "/styles.css": {
    code: `.App {
  font-family: sans-serif;
  text-align: center;
}

.card {
  padding: 2rem;
  margin-top: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}`
  },
};