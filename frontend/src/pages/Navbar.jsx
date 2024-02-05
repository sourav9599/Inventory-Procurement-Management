import {
	Avatar,
	Box,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	TextField,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";

const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));
const Navbar = ({ open, setOpen }) => {
	const { user, signOut, session } = useAuth();
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBar position="fixed" open={open} sx={{ backgroundColor: "#112131" }}>
			<Toolbar>
				<Stack direction="row" justifyContent="space-between" width="100%">
					<Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={() => setOpen(true)}
							edge="start"
							sx={{
								marginRight: 1,
								...(open && { display: "none" }),
							}}
						>
							<MenuIcon />
						</IconButton>

						<img src="/assets/logo-white.svg" alt="logo" width="50px" />

						<Typography variant="h6">
							Kriss Drilling India Private Limited
						</Typography>
					</Box>

					<Box
						sx={{
							flexGrow: 0,
							display: "flex",
							alignItems: "center",
							gap: "1rem",
						}}
					>
						<TextField
							sx={{
								input: { color: "white" },
								"& .MuiInputLabel-root": {
									color: "white",
								},
								"& label.Mui-focused": {
									color: "white",
								},
								"& .MuiInput-underline:after": {
									borderBottomColor: "white",
								},
								"& .MuiOutlinedInput-root": {
									"& fieldset": {
										borderColor: "white",
									},
									"&:hover fieldset": {
										borderColor: "white",
									},
									"&.Mui-focused fieldset": {
										borderColor: "white",
									},
								},
							}}
							size="small"
							variant="outlined"
							label="Persona"
							value={session.accessToken.payload["cognito:groups"][0]}
						/>
						<Typography>{user.email}</Typography>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar alt="Remy Sharp" src="#" />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							<Link to="/user-profile">
								<MenuItem key="Profile">
									<Typography textAlign="center">Profile</Typography>
								</MenuItem>
							</Link>

							<MenuItem key="Logout" onClick={signOut}>
								<Typography textAlign="center">Logout</Typography>
							</MenuItem>
						</Menu>
					</Box>
				</Stack>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
