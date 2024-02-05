import { Alert, Backdrop, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toastMessage from "../../utils/ToastMessage";
function Copyright(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{"Copyright © "}
			<Link color="inherit" href="#">
				Kriss Drilling Private Limited
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

export default function SignIn() {
	const { user, signIn, userDetails } = useAuth();
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);
	if (user) {
		// Redirect to the profile page
		return <Navigate to="/view-inventory" />;
	}
	if (error === "User is not confirmed.") {
		return <Navigate to="/confirm-sign-up" />;
	}

	const handleSubmit = (event) => {
		setLoading(true);
		setError(null);
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		let email = data.get("email");
		let password = data.get("password");

		signIn(email, password)
			.then((data) => {
				toastMessage("success", "Successfully Logged In !");
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
				console.log(err.message);
			});
		console.log(userDetails);
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				{/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
					<LockOutlinedIcon />
				</Avatar> */}
				<img src="/assets/logo.svg" height="150px" alt="logo" />
				{/* <Typography component="h1" variant="h5">
					Sign in
				</Typography> */}
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
					/>
					<FormControlLabel
						control={<Checkbox value="remember" color="primary" />}
						label="Remember me"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<Link href="/forgot-password" variant="body2">
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							<Link href="/sign-up" variant="body2">
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
					{error && (
						<Alert severity="error" sx={{ marginTop: "1rem" }}>
							{error}
						</Alert>
					)}
				</Box>
				<Backdrop
					sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={loading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
			</Box>
			<Copyright sx={{ mt: 8, mb: 4 }} />
		</Container>
	);
}
