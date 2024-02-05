import {
	Box,
	Button,
	Chip,
	Divider,
	FormControl,
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
import LogsInfo from "../../components/LogsInfo";
import UpdateComponent from "../../components/UpdateModal/UpdateComponent";
import UpdateRig from "../../components/UpdateModal/UpdateRig";
import UpdateSubComponent from "../../components/UpdateModal/UpdateSubComponent";
import toastMessage from "../../utils/ToastMessage";
import UpdateSpare from "../../components/UpdateModal/UpdateSpare";

const ViewInventory = () => {
	const [rigDetails, setRigDetails] = useState();
	const [rigList, setRigList] = useState([]);
	const [componentList, setComponentList] = useState([]);
	const [subComponentList, setSubComponentList] = useState([]);
	const [rig, setRig] = useState("");
	const [component, setComponent] = useState("");
	const [subComponent, setSubComponent] = useState("");
	const [subComponentDetails, setSubComponentDetails] = useState();
	const [subComponentMetadata, setSubComponentMetadata] = useState({});

	const [materialDetailsList, setMaterialDetailsList] = useState([]);
	const [columnDefs, setColumnDefs] = useState([]);
	const [rowData, setRowData] = useState([]);

	function showDetails(params) {
		const logId =
			rig + "_" + component + "_" + subComponent + "_" + params.data.id;
		return (
			<LogsInfo materialName={params.data.name} logId={logId} />
			// <PurchaseInformation
			// 	materialData={params.data}
			// 	rigId={rigDetails.rigId}
			// 	componentId={componentList[component].id}
			// 	subComponentId={subComponentList[subComponent].id}
			// />
		);
	}
	function createGridSchema() {
		if (materialDetailsList.length) {
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
					field: "description",
					headerName: "Description",
					filter: "agTextColumnFilter",
				},
				{
					field: "specification",
					headerName: "Specification",
					filter: "agTextColumnFilter",
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
				{
					field: "logs",
					headerName: "Logs",
					cellRenderer: (params) => showDetails(params),
				},
				{
					field: "Edit",
					headerName: "Edit",
					cellRenderer: (params) => (
						<UpdateSpare id={params.data.id} data={params.data} />
					),
				},
			]);
		}
	}

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
		setSubComponentDetails({});
		setRowData([]);
		axios
			.get(process.env.REACT_APP_BACKEND_URL + "/api/v1/rig?rigId=" + rig)
			.then((response) => {
				setRigDetails(response.data);
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
				setSubComponentDetails(response.data);
				if (rig + "_" + component in response.data.spareMap) {
					setMaterialDetailsList(response.data.spareMap[rig + "_" + component]);
				}
				if (rig + "_" + component in response.data.subComponentData) {
					setSubComponentMetadata(
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

	const updateSubComponent = () => {
		const params = {
			rigId: rig,
			componentId: component,
			subComponentId: subComponent,
		};
		axios
			.post(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/subcomponent/update-subcomponent?" +
					new URLSearchParams(params),
				{
					worksRequired: subComponentMetadata.worksRequired,
					detailsOfTesting: subComponentMetadata.detailsOfTesting,
				}
			)
			.then(() => {
				toastMessage(
					"success",
					"Successfully updated " + subComponentDetails.name
				);
			})
			.catch(() => {
				toastMessage("error", "Failed to update " + subComponentDetails.name);
			});
	};

	const handleRigChange = (event) => {
		setRig(event.target.value);
	};
	const handleSubComponentlMetadataChange = (event) => {
		const { name, value } = event.target;
		setSubComponentMetadata({
			...subComponentMetadata,
			[name]: value,
		});
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
		createGridSchema();
	}, [materialDetailsList]);

	return (
		<Box gap={2} sx={{ display: "flex", flexDirection: "column" }}>
			<Stack direction="row" gap={2} justifyContent="space-between">
				<Box width="20%">
					<Typography
						variant="h4"
						component="h1"
						sx={{ fontWeight: "600", color: "#4f4f4f" }}
						gutterBottom
					>
						Inventory
					</Typography>
				</Box>
				<Stack
					direction="row"
					justifyContent="flex-end"
					alignItems="center"
					gap={2}
					width={1}
				>
					<FormControl sx={{ minWidth: "20%" }} size="small">
						<InputLabel id="select-rig-input-label">Select Rig</InputLabel>
						<Select
							labelId="select-rig-label"
							id="Select Rig"
							value={rig}
							label="Select Rig"
							onChange={handleRigChange}
						>
							{rigList.map((rig) => (
								<MenuItem value={rig.id} key={rig.id}>
									{rig.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Box display={"flex"} gap={2}>
						<Button variant="contained" onClick={getRigDetails}>
							Get Details
						</Button>
						<UpdateRig rigId={rig} />
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
									{componentList.map((component) => (
										<MenuItem value={component.id} key={component.id}>
											{component.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<UpdateComponent componentId={component} />
							<FormControl sx={{ minWidth: "20%" }} size="small">
								<InputLabel id="select-rig-input-label">
									Select Equipment
								</InputLabel>
								<Select
									labelId="Select-Sub-Component-label"
									id="Select-Sub-Component"
									value={subComponent}
									label="Select Equipment"
									onChange={(e) => setSubComponent(e.target.value)}
									disabled={!subComponentList.length}
								>
									{subComponentList.map((subcomponent) => (
										<MenuItem value={subcomponent.id} key={subcomponent.id}>
											{subcomponent.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<UpdateSubComponent id={subComponent} />
						</>
					)}
				</Stack>
			</Stack>
			{subComponent !== "" && subComponentDetails && subComponentMetadata && (
				<Stack gap={2}>
					<Divider>
						<Chip label="Equipment Details" />
					</Divider>
					<Stack direction="row" justifyContent="space-around" gap={4}>
						<TextField
							label="ID"
							fullWidth
							size="small"
							value={subComponentDetails.id}
							InputProps={{
								readOnly: true,
							}}
							InputLabelProps={{ shrink: true }}
							disabled
						/>
						<TextField
							size="small"
							fullWidth
							label="name"
							value={subComponentDetails.name}
							InputProps={{
								readOnly: true,
							}}
							InputLabelProps={{ shrink: true }}
							disabled
						/>
						<TextField
							size="small"
							fullWidth
							label="model"
							value={subComponentDetails.model}
							InputProps={{
								readOnly: true,
							}}
							InputLabelProps={{ shrink: true }}
							disabled
						/>
						<TextField
							size="small"
							fullWidth
							label="Quantity"
							value={subComponentMetadata.totalQuantity}
							InputProps={{
								readOnly: true,
							}}
							InputLabelProps={{ shrink: true }}
							disabled
						/>
						<Box display={"flex"} gap={2}>
							<Button
								variant="contained"
								onClick={updateSubComponent}
								disabled={
									!(
										subComponentMetadata.worksRequired ||
										subComponentMetadata.detailsOfTesting
									)
								}
							>
								Update
							</Button>
						</Box>

						<LogsInfo
							materialName={subComponentDetails.name}
							logId={rig + "_" + component + "_" + subComponent}
						/>
					</Stack>
					<Stack direction="row" gap={4}>
						<TextField
							multiline
							size="small"
							fullWidth
							label="description"
							value={
								subComponentDetails.description
									? subComponentDetails.description
									: " "
							}
							InputProps={{
								readOnly: true,
							}}
							InputLabelProps={{ shrink: true }}
							disabled
						/>
						<TextField
							multiline
							size="small"
							fullWidth
							label="specification"
							value={subComponentDetails.specification}
							InputProps={{
								readOnly: true,
							}}
							InputLabelProps={{ shrink: true }}
							disabled
						/>
						<TextField
							multiline
							size="small"
							fullWidth
							label="Works Required"
							name="worksRequired"
							value={
								subComponentMetadata.worksRequired
									? subComponentMetadata.worksRequired
									: ""
							}
							onChange={handleSubComponentlMetadataChange}
						/>
						<TextField
							multiline
							size="small"
							fullWidth
							label="Details Of Testing"
							name="detailsOfTesting"
							value={
								subComponentMetadata.detailsOfTesting
									? subComponentMetadata.detailsOfTesting
									: ""
							}
							onChange={handleSubComponentlMetadataChange}
						/>
					</Stack>
				</Stack>
			)}
			<Divider>
				<Chip label="Spare Details" />
			</Divider>

			<Box sx={{ height: "80dvh" }}>
				<GridTable rows={rowData} columnDefs={columnDefs} />
			</Box>
		</Box>
	);
};

export default ViewInventory;
