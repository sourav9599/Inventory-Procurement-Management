import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
const CustomFontTheme = createTheme({
	typography: {
		fontFamily: "Inter",
		button: {
			fontFamily: "Inter",
		},
	},
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<ThemeProvider theme={CustomFontTheme}>
			<App />
		</ThemeProvider>
	</React.StrictMode>
);
