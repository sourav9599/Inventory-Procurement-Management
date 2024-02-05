import { Backdrop, Box, CircularProgress, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import dayjs from "dayjs";
import * as React from "react";
import toastMessage from "../../utils/ToastMessage";
import DatePickerValue from "../DatePickerValue";
import EditIcon from "@mui/icons-material/Edit";

export default function UpdateRig({ rigId }) {
	const [open, setOpen] = React.useState(false);
	const [dateValue, setDateValue] = React.useState("");
	const [rigName, setRigName] = React.useState("");
	const [location, setLocation] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const handleClickOpen = () => {
		getRigDetails();
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const getRigDetails = () => {
		axios
			.get(process.env.REACT_APP_BACKEND_URL + "/api/v1/rig?rigId=" + rigId)
			.then((response) => {
				setRigName(response.data.rigName);
				setLocation(response.data.location);
				setDateValue(dayjs(response.data.dateOfInception));
			})
			.catch(() => {
				toastMessage("error", "Failed to fetch rig details");
			});
	};

	const updateRig = () => {
		setLoading(true);
		const body = {
			rigId: rigId,
			rigName: rigName,
			location: location,
			dateOfInception: dayjs(dateValue).valueOf(),
		};
		axios
			.post(process.env.REACT_APP_BACKEND_URL + "/api/v1/rig/edit", body)
			.then(() => {
				toastMessage("success", "Rig has been updated successfully");
				setLoading(false);
				window.location.reload();
			})
			.catch((err) => {
				console.log(err.message);
				toastMessage("error", err.response.data.message);
				setLoading(false);
			});
	};

	return (
		<div>
			<Button variant="contained" onClick={handleClickOpen} disabled={!rigId}>
				<EditIcon />
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<Backdrop
					sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={loading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
				<DialogTitle id="alert-dialog-title">Update Rig</DialogTitle>
				<DialogContent>
					<Box
						component="form"
						sx={{
							"& .MuiTextField-root": { m: 1, width: "25ch" },
						}}
						noValidate
						autoComplete="off"
					>
						<TextField
							required
							id="rig-name"
							label="Rig Name"
							value={rigName}
							onChange={(e) => setRigName(e.target.value)}
						/>
						<TextField
							required
							id="location"
							label="Location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
						<DatePickerValue
							dateValue={dateValue}
							setDateValue={setDateValue}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" onClick={updateRig}>
						Update Rig
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
