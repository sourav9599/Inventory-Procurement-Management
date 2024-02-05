import {
	Alert,
	Backdrop,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
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
import AddMetadata from "./AddMetadata";

export default function AddSpare({ usageTypeList, categoryList }) {
	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [model, setModel] = React.useState("");
	const [specification, setSpecification] = React.useState("");
	const [reorderPoint, setReorderPoint] = React.useState("");
	const [usageType, setUsageType] = React.useState("");
	const [category, setCategory] = React.useState("");
	const [error, setError] = React.useState();
	const [loading, setLoading] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const addSpare = () => {
		setLoading(true);
		axios
			.post(process.env.REACT_APP_BACKEND_URL + "/api/v1/spare", {
				name,
				description,
				model,
				specification,
				reorderPoint,
				usageType,
				category,
			})
			.then(() => {
				setLoading(false);
				toastMessage(
					"success",
					"Spare : " + name + " has been created successfully"
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
				<DialogTitle id="alert-dialog-title">Add New Spare</DialogTitle>
				<DialogContent>
					<Stack gap={2}>
						<TextField
							size="small"
							disabled={loading}
							sx={{ marginTop: "1rem" }}
							required
							id="spare-name"
							label="Spare Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<TextField
							size="small"
							multiline
							disabled={loading}
							required
							id="Description"
							label="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<TextField
							size="small"
							disabled={loading}
							required
							id="Model"
							label="Model"
							value={model}
							onChange={(e) => setModel(e.target.value)}
						/>
						<TextField
							size="small"
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
						<Stack
							direction="row"
							gap={2}
							justifyContent="flex-start"
							alignItems="center"
							sx={{ minWidth: "25rem" }}
						>
							<FormControl fullWidth size="small" required>
								<InputLabel id="material-label">Usage Type</InputLabel>
								<Select
									labelId="UsageType-label"
									id="UsageType"
									name="usageType"
									label="UsageType"
									value={usageType}
									onChange={(e) => setUsageType(e.target.value)}
								>
									{usageTypeList.map((usageType) => (
										<MenuItem
											name={usageType.name}
											value={usageType.name}
											key={usageType.id}
										>
											{usageType.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<AddMetadata metadata="usageType" />
						</Stack>
						<Stack
							direction="row"
							gap={2}
							justifyContent="flex-start"
							alignItems="center"
							sx={{ minWidth: "25rem" }}
						>
							<FormControl fullWidth size="small" required>
								<InputLabel id="material-label">Category</InputLabel>
								<Select
									labelId="category-label"
									id="category"
									label="category"
									value={category}
									onChange={(e) => setCategory(e.target.value)}
								>
									{categoryList.map((category) => (
										<MenuItem
											name={category.name}
											value={category.name}
											key={category.id}
										>
											{category.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<AddMetadata metadata="category" />
						</Stack>
						{error && <Alert severity="error"> {error} </Alert>}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={
							name &&
							description &&
							model &&
							specification &&
							reorderPoint &&
							usageType &&
							category
								? false
								: true
						}
						variant="contained"
						onClick={addSpare}
					>
						Add Spare
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
