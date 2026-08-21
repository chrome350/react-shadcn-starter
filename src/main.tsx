import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import "@fontsource/inter/cyrillic-400.css"
import "@fontsource/inter/cyrillic-500.css"
import "@fontsource/inter/cyrillic-600.css"
import "@fontsource/inter/cyrillic-700.css"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
