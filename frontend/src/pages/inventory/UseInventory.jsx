import {
	Alert,
	Backdrop,
	Box,
	Button,
	CircularProgress,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import GridTable from "../../components/GridTable";
import toastMessage from "../../utils/ToastMessage";
import { useAuth } from "../../context/AuthContext";

const UseInventory = () => {
	const { user } = useAuth();
	const [rigList, setRigList] = useState([]);
	const [componentList, setComponentList] = useState([]);
	const [subComponentList, setSubComponentList] = useState([]);
	const [rig, setRig] = useState("");
	const [component, setComponent] = useState("");
	const [subComponent, setSubComponent] = useState("");
	const [removeSpare, setRemoveSpare] = useState("");
	const [usedQuantity, setUsedQuantity] = useState("");
	const [comment, setComment] = useState("");
	const [materialType, setMaterialType] = useState("");
	const [loading, setLoading] = useState(false);
	const [materialDetailsList, setMaterialDetailsList] = useState([]);

	const [subComponentDetails, setSubComponentDetails] = useState({});
	const [columnDefs, setColumnDefs] = useState([]);
	const [rowData, setRowData] = useState([]);

	function createGridSchema() {
		getSpareDetails();
		setColumnDefs([
			{
				field: "id",
				headerName: "Spare ID",
				filter: "agTextColumnFilter",
			},
			{
				field: "name",
				headerName: "Spare Name",
				filter: "agTextColumnFilter",
			},
			{
				field: "model",
				headerName: "Model",
				filter: "agTextColumnFilter",
			},
			{
				field: "quantity",
				headerName: "Available Stock",
				filter: "agNumberColumnFilter",
			},
			{
				field: "reorderPoint",
				headerName: "Reorder Point",
				filter: "agNumberColumnFilter",
			},
			{
				field: "usageType",
				headerName: "Usage Type",
				filter: "agTextColumnFilter",
			},
			{
				field: "category",
				headerName: "Category",
				filter: "agTextColumnFilter",
			},
		]);
	}

	const removeMaterials = () => {
		setLoading(true);
		let params = {
			rigId: rig,
			componentId: component,
			subComponentId: subComponent,
			quantity: usedQuantity,
			comment: comment,
			user: user.email,
		};
		let endpoint =
			process.env.REACT_APP_BACKEND_URL +
			"/api/v1/subcomponent/remove-quantity?";

		if (materialType === "Spare") {
			params = {
				rigId: rig,
				componentId: component,
				subComponentId: subComponent,
				spareId: removeSpare,
				quantity: usedQuantity,
				comment: comment,
				user: user.email,
			};
			endpoint =
				process.env.REACT_APP_BACKEND_URL + "/api/v1/spare/remove-quantity?";
		}

		axios
			.post(endpoint + new URLSearchParams(params).toString())
			.then(() => {
				setLoading(false);
				toastMessage("success", "Successfully Removed Material Quantity");
			})
			.catch((error) => {
				setLoading(false);
				toastMessage("error", error.response.data.message);
			});
	};
	const getList = (value, setter) => {
		axios
			.get(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/metadata?metadataName=" +
					value
			)
			.then((response) => {
				setter(response.data.metadataDetails);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const getRigDetails = () => {
		setComponentList([]);
		setComponent("");
		setSubComponent("");
		setSubComponentList([]);
		setMaterialDetailsList([]);
		axios
			.get(process.env.REACT_APP_BACKEND_URL + "/api/v1/rig?rigId=" + rig)
			.then((response) => {
				setComponentList(response.data.componentList);
			})
			.catch((error) => {
				toastMessage("error", "Unable to fetch rig details");
				console.log(error);
			});
	};

	const getComponentDetails = () => {
		axios
			.get(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/component?componentId=" +
					component
			)
			.then((response) => {
				if (rig in response.data.subComponentMap) {
					setSubComponentList(response.data.subComponentMap[rig]);
				}
			})
			.catch((error) => {
				toastMessage("error", "Unable to fetch component details");
				console.log(error);
			});
	};
	const getSubComponentDetails = () => {
		axios
			.get(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/subcomponent?subComponentId=" +
					subComponent
			)
			.then((response) => {
				if (rig + "_" + component in response.data.spareMap) {
					setMaterialDetailsList(response.data.spareMap[rig + "_" + component]);
				}
				if (rig + "_" + component in response.data.subComponentData) {
					setSubComponentDetails(
						response.data.subComponentData[rig + "_" + component]
					);
				}
			})
			.catch((error) => {
				toastMessage("error", "Unable to fetch Equipment details");
				console.log(error);
			});
	};

	const getSpareDetails = () => {
		const params = {
			rigId: rig,
			componentId: component,
			subComponentId: subComponent,
		};
		console.log(materialDetailsList);
		axios
			.post(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/spare/get-details?" +
					new URLSearchParams(params).toString(),
				materialDetailsList
			)
			.then((response) => {
				setRowData(response.data);
			})
			.catch((error) => {
				toastMessage("error", "Unable to fetch Spare details");
				console.log(error);
			});
	};

	const handleQuantity = (e) => {
		const eventVal = e.target.value;

		if (eventVal < 0) {
			setUsedQuantity(0);
		} else {
			setUsedQuantity(parseInt(eventVal));
		}
	};

	useEffect(() => {
		getList("rig", setRigList);
	}, []);

	useEffect(() => {
		if (component !== "") {
			getComponentDetails();
		}
	}, [component]);

	useEffect(() => {
		if (subComponent !== "") {
			getSubComponentDetails();
		}
	}, [subComponent]);

	useEffect(() => {
		setComment("");
		setRemoveSpare("");
		setMaterialType("");
		if (materialDetailsList) {
			createGridSchema();
		}
	}, [materialDetailsList]);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
			}}
			gap={2}
		>
			<Typography
				variant="h4"
				component="h1"
				sx={{ fontWeight: "600", color: "#4f4f4f" }}
				gutterBottom
			>
				Use Materials From Rigs
			</Typography>
			<Divider />
			<Stack gap={2} sx={{ backgroundColor: "#e4eaf1", padding: "2rem" }}>
				<Stack direction="row" gap={2}>
					<FormControl sx={{ minWidth: "20%" }} size="small">
						<InputLabel id="select-rig-input-label">Select Rig</InputLabel>
						<Select
							labelId="select-rig-label"
							id="select-rig"
							value={rig}
							label="Select Rig"
							onChange={(e) => setRig(e.target.value)}
						>
							{rigList.map((rig) => (
								<MenuItem value={rig.id} key={rig.id}>
									{rig.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Box>
						<Button variant="contained" onClick={getRigDetails}>
							Get Details
						</Button>
					</Box>
					{Boolean(componentList.length) && (
						<>
							<FormControl sx={{ minWidth: "20%" }} size="small">
								<InputLabel id="Select-Component-input-label">
									Select Component
								</InputLabel>
								<Select
									labelId="Select-Component-label"
									id="Select-Component"
									value={component}
									label="Select Component"
									onChange={(e) => setComponent(e.target.value)}
									disabled={!componentList.length}
								>
									{componentList.map((component, index) => (
										<MenuItem value={component.id} key={component.id}>
											{component.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<FormControl sx={{ minWidth: "20%" }} size="small">
								<InputLabel id="select-rig-input-label">
									Select Equipment
								</InputLabel>
								<Select
									labelId="Select-Sub-Component-label"
									id="Select-Equipment"
									value={subComponent}
									label="Select Equipment"
									onChange={(e) => setSubComponent(e.target.value)}
									disabled={!subComponentList.length}
								>
									{subComponentList.map((subcomponent, index) => (
										<MenuItem value={subcomponent.id} key={subcomponent.id}>
											{subcomponent.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</>
					)}
				</Stack>
				{subComponent !== "" && (
					<Box width="30%">
						<Alert severity="success">
							Available Euipment Quantity : {subComponentDetails.totalQuantity}
						</Alert>
					</Box>
				)}
				<Grid container spacing={4}>
					{Boolean(materialDetailsList.length) && (
						<Grid item lg={8} md={12} sx={{ height: "70dvh" }}>
							<GridTable rows={rowData} columnDefs={columnDefs} />
						</Grid>
					)}
					{subComponent !== "" && (
						<Grid item lg={4} md={12} gap={2} sx={{ marginTop: "2rem" }}>
							<Stack
								sx={{
									backgroundColor: "white",
									padding: "2rem",
									border: "1px solid #d8dfe6",
									borderRadius: "8px",
									boxShadow:
										"rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;",
								}}
							>
								<Box
									sx={{
										border: "1px solid gray",
										borderRadius: "3px",
										padding: "2rem",
										marginBottom: "2rem",
										gap: "2rem",
										display: "flex",
										flexDirection: "column",
									}}
								>
									<Box
										display={"flex"}
										sx={{ flexDirection: "column", gap: "1rem" }}
									>
										<FormControl fullWidth size="small">
											<InputLabel id="demo-simple-select-label">
												Material Type
											</InputLabel>
											<Select
												labelId="Material Type-label"
												id="Material Type-select"
												value={materialType}
												label="Material Type"
												onChange={(e) => setMaterialType(e.target.value)}
											>
												<MenuItem value="Equipment">Equipment</MenuItem>
												<MenuItem value="Spare">Spare</MenuItem>
											</Select>
										</FormControl>
										{materialType && (
											<Stack gap={2}>
												<Stack direction={"row"} gap={2}>
													{materialType === "Spare" ? (
														<FormControl fullWidth size="small">
															<InputLabel id="demo-simple-select-label">
																Spare
															</InputLabel>
															<Select
																labelId="demo-simple-select-label"
																id="demo-simple-select"
																value={removeSpare}
																label="Spare"
																onChange={(e) => setRemoveSpare(e.target.value)}
															>
																{materialDetailsList.map((item) => (
																	<MenuItem value={item.id} key={item.id}>
																		{item.id + "-" + item.name}
																	</MenuItem>
																))}
															</Select>
														</FormControl>
													) : (
														<TextField
															size="small"
															variant="outlined"
															label="Equipment"
															value={subComponent}
														/>
													)}

													<TextField
														size="small"
														variant="outlined"
														type="number"
														label="Remove"
														value={usedQuantity}
														inputProps={{
															min: 1,
														}}
														onChange={(e) => handleQuantity(e)}
													/>
												</Stack>
												<TextField
													multiline
													size="small"
													variant="outlined"
													label="Comments"
													required
													value={comment}
													onChange={(e) => setComment(e.target.value)}
												/>
												<Button
													size="small"
													color="error"
													variant="contained"
													onClick={removeMaterials}
													disabled={!(comment && usedQuantity)}
												>
													Remove Materials
												</Button>
											</Stack>
										)}
									</Box>
									{/* <UsedQuantity
										quantityList={materialDetailsList}
										rigId={rig}
										componentId={componentList[component].id}
										subComponentId={subComponentList[subComponent].id}
									/> */}
								</Box>
							</Stack>
						</Grid>
					)}
				</Grid>
			</Stack>
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={loading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</Box>
	);
};

export default UseInventory;
