import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { styled } from "@mui/material/styles";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

export default function RootLayout() {
	const [open, setOpen] = useState(false);

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<Navbar open={open} setOpen={setOpen} />
			<Sidebar open={open} setOpen={setOpen} />
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<DrawerHeader />

				<ToastContainer />
				<Outlet />
			</Box>
		</Box>
	);
}
