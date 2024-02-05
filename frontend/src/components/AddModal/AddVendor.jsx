import {
	Alert,
	Backdrop,
	CircularProgress,
	Stack,
	TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import * as React from "react";
import toastMessage from "../../utils/ToastMessage";

export default function AddVendor() {
	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState("");
	const [address, setAddress] = React.useState("");
	const [contactInfo, setContactInfo] = React.useState("");
	const [error, setError] = React.useState();
	const [loading, setLoading] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const addVendor = () => {
		setLoading(true);
		axios
			.post(process.env.REACT_APP_BACKEND_URL + "/api/v1/vendor", {
				name,
				address,
				contactInfo,
			})
			.then(() => {
				setLoading(false);
				toastMessage(
					"success",
					"Vendor : " + name + " has been created successfully"
				);
				window.location.reload();
			})
			.catch((err) => {
				setError(err.message);
				toastMessage("error", err.message);
				setLoading(false);
			});
	};

	return (
		<div>
			<Button variant="contained" onClick={handleClickOpen}>
				ADD
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				maxWidth="md"
			>
				<Backdrop
					sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={loading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
				<DialogTitle id="alert-dialog-title">Add New Vendor</DialogTitle>
				<DialogContent>
					<Stack gap={2}>
						<TextField
							disabled={loading}
							sx={{ marginTop: "1rem" }}
							required
							id="Vendor-name"
							label="Vendor Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<TextField
							multiline
							disabled={loading}
							sx={{ marginTop: "1rem" }}
							required
							id="address"
							label="Address"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>
						<TextField
							disabled={loading}
							sx={{ marginTop: "1rem" }}
							required
							id="Contact-info"
							label="Contact Details"
							value={contactInfo}
							onChange={(e) => setContactInfo(e.target.value)}
						/>
						{error && <Alert severity="error"> {error} </Alert>}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={name && address && contactInfo ? false : true}
						variant="contained"
						onClick={addVendor}
					>
						Add Vendor
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
