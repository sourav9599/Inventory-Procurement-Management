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

export default function UpdateSubComponent({ id }) {
	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [model, setModel] = React.useState("");
	const [specification, setSpecification] = React.useState("");
	const [reorderPoint, setReorderPoint] = React.useState("");
	const [error, setError] = React.useState();
	const [loading, setLoading] = React.useState(false);

	const handleClickOpen = () => {
		getSubComponentDetails();
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const getSubComponentDetails = () => {
		axios
			.get(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/subcomponent?subComponentId=" +
					id
			)
			.then((response) => {
				setName(response.data.name);
				setDescription(response.data.description);
				setSpecification(response.data.specification);
				setModel(response.data.model);
				setReorderPoint(response.data.reorderPoint);
			})
			.catch(() => {
				toastMessage("error", "Failed to fetch equipment details");
			});
	};

	const updateSubComponent = () => {
		setLoading(true);
		axios
			.post(process.env.REACT_APP_BACKEND_URL + "/api/v1/subcomponent/edit", {
				id,
				name,
				description,
				model,
				specification,
				reorderPoint,
			})
			.then(() => {
				setLoading(false);
				toastMessage(
					"success",
					"Equipment : " + name + " has been updated successfully"
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
			<Button variant="contained" onClick={handleClickOpen} disabled={!id}>
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
				<DialogTitle id="alert-dialog-title">Update Equipment</DialogTitle>
				<DialogContent>
					<Stack gap={2}>
						<TextField
							disabled={loading}
							sx={{ marginTop: "1rem" }}
							required
							id="equipment-name"
							label="Equipment Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<TextField
							multiline
							disabled={loading}
							required
							id="Description"
							label="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<TextField
							disabled={loading}
							required
							id="Model"
							label="Model"
							value={model}
							onChange={(e) => setModel(e.target.value)}
						/>
						<TextField
							multiline
							disabled={loading}
							required
							id="Specification"
							label="Specification"
							value={specification}
							onChange={(e) => setSpecification(e.target.value)}
						/>
						<TextField
							size="small"
							id="reorderPoint"
							label="Reorder Point"
							variant="outlined"
							type="number"
							required
							value={reorderPoint}
							onChange={(e) => setReorderPoint(e.target.value)}
							inputProps={{
								min: 1,
							}}
						/>
						{error && <Alert severity="error"> {error} </Alert>}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={
							!(name && description && model && specification && reorderPoint)
						}
						variant="contained"
						onClick={updateSubComponent}
					>
						Update Equipment
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
