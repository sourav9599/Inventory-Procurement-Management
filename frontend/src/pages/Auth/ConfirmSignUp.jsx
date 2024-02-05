import {
	Alert,
	Box,
	Button,
	Container,
	CssBaseline,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { confirmSignUp } from "../../auth/Auth";

export default function ConfirmSignUp() {
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			await confirmSignUp(email, code);
			setSuccess(true);
		} catch (err) {
			setError(err.message);
		}
	};

	if (success) {
		return <Navigate to="/sign-in" />;
	}

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
				<Typography component="h1" variant="h5">
					Confirm Sign Up
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoFocus
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="code"
						label="code"
						type="number"
						id="code"
						autoComplete="current-code"
						value={code}
						onChange={(e) => setCode(e.target.value)}
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Verify Code
					</Button>

					{error && (
						<Alert severity="error" sx={{ marginTop: "1rem" }}>
							{error}
						</Alert>
					)}
				</Box>
			</Box>
		</Container>
	);
}
