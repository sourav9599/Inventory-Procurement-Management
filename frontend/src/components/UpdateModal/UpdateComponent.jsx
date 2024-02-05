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
import EditIcon from "@mui/icons-material/Edit";

export default function UpdateComponent({ componentId }) {
	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [error, setError] = React.useState();
	const [loading, setLoading] = React.useState(false);

	const handleClickOpen = () => {
		getComponentDetails();
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const getComponentDetails = () => {
		axios
			.get(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/component?componentId=" +
					componentId
			)
			.then((response) => {
				setName(response.data.name);
				setDescription(response.data.description);
			})
			.catch(() => {
				toastMessage("error", "Failed to fetch component details");
			});
	};

	const updateComponent = () => {
		setLoading(true);
		axios
			.post(process.env.REACT_APP_BACKEND_URL + "/api/v1/component/edit", {
				id: componentId,
				name: name,
				description: description,
			})
			.then(() => {
				setLoading(false);
				toastMessage(
					"success",
					"Component : " + name + " has been updated successfully"
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
			<Button
				variant="contained"
				onClick={handleClickOpen}
				disabled={!componentId}
			>
				<EditIcon />
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
				<DialogTitle id="alert-dialog-title">Update Component</DialogTitle>
				<DialogContent>
					<Stack gap={2}>
						<TextField
							disabled={loading}
							sx={{ marginTop: "1rem" }}
							required
							id="component-name"
							label="component Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<TextField
							multiline
							disabled={loading}
							sx={{ marginTop: "1rem" }}
							required
							id="description"
							label="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						{error && <Alert severity="error"> {error} </Alert>}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={name && description ? false : true}
						variant="contained"
						onClick={updateComponent}
					>
						Update Component
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
