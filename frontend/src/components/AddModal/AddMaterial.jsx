import { Alert, Backdrop, CircularProgress, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import * as React from "react";
import toastMessage from "../../utils/ToastMessage";

export default function AddMaterial({ rigId }) {
	const [open, setOpen] = React.useState(false);
	const [materialName, setMaterialName] = React.useState("");
	const [error, setError] = React.useState();
	const [loading, setLoading] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const addMaterial = () => {
		setLoading(true);
		axios
			.post(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/metadata/" +
					rigId +
					"_material?metadataValue=" +
					materialName
			)
			.then(() => {
				setLoading(false);
				toastMessage(
					"success",
					"Material : " + materialName + " has been created successfully"
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
			>
				<Backdrop
					sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={loading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
				<DialogTitle id="alert-dialog-title">Add New Material</DialogTitle>
				<DialogContent>
					<TextField
						disabled={loading}
						sx={{ marginTop: "1rem" }}
						required
						id="material-name"
						label="Material Name"
						value={materialName}
						onChange={(e) => setMaterialName(e.target.value)}
					/>
					{error && <Alert severity="error"> {error} </Alert>}
				</DialogContent>
				<DialogActions>
					<Button
						disabled={materialName ? false : true}
						variant="contained"
						onClick={addMaterial}
					>
						Add Material
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
