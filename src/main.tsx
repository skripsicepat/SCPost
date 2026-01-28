import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

const basename = import.meta.env.BASE_URL;
const rootElement = document.getElementById("root");

// Log environment for debugging
console.log("App starting...");
console.log("BASE_URL:", basename);
console.log("Has Supabase URL:", !!import.meta.env.VITE_SUPABASE_URL);

if (!rootElement) {
  console.error("Root element not found! HTML structure may be broken.");
  document.body.innerHTML = "<p style=\"color: red; font-family: sans-serif; padding: 20px;\">ERROR: Root element not found</p>";
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    );
    console.log("App mounted successfully");
  } catch (error) {
    console.error("React render error:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    rootElement.innerHTML = `<p style="color: red; font-family: sans-serif; padding: 20px;">ERROR: ${errorMsg}</p>`;
  }
}
