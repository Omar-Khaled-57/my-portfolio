import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { I18nProvider } from "./i18n.jsx"
import { ThemeProvider } from "./context/ThemeContext.jsx"
import { DataProvider } from "./context/DataContext.jsx"

if (typeof window !== "undefined") {
  const originalConsoleError = console.error
  console.error = (...args) => {
    const msg = args[0]
    if (typeof msg === "string" && (msg.includes("WebSocket") || msg.includes("realtime"))) return
    originalConsoleError(...args)
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ThemeProvider>
			<I18nProvider>
				<DataProvider>
					<App />
				</DataProvider>
			</I18nProvider>
		</ThemeProvider>
	</React.StrictMode>,
)
