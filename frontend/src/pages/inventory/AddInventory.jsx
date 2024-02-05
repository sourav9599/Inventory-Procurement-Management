import {
	Alert,
	Backdrop,
	Box,
	Button,
	Chip,
	CircularProgress,
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

import dayjs from "dayjs";
import AddComponent from "../../components/AddModal/AddComponent";
import AddRig from "../../components/AddModal/AddRig";
import AddSpare from "../../components/AddModal/AddSpare";
import AddSubComponent from "../../components/AddModal/AddSubComponent";
import { useAuth } from "../../context/AuthContext";
import toastMessage from "../../utils/ToastMessage";

const AddInventory = () => {
	const { user } = useAuth();
	const [rigList, setRigList] = useState([]);
	const [componentList, setComponentList] = useState([]);
	const [subComponentList, setSubComponentList] = useState([]);
	const [spareList, setSpareList] = useState([]);
	const [manufacturerList, setManufacturerList] = useState([]);
	const [vendorList, setVendorList] = useState([]);
	const [projectList, setProjectList] = useState([]);
	const [usageTypeList, setUsageTypeList] = useState([]);
	const [categoryList, setCategoryList] = useState([]);

	const [rig, setRig] = useState("");
	const [component, setComponent] = useState("");
	const [subComponent, setSubComponent] = useState("");
	const [spare, setSpare] = useState("");
	const [project, setProject] = useState("");
	const [manufacturer, setManufacturer] = useState("");
	const [vendor, setVendor] = useState("");
	const [price, setPrice] = useState();
	const [quantity, setQuantity] = useState();
	const [dateOfPurchase, setDateOfPurchase] = useState(dayjs());
	const [statusMessage, setStatusMessage] = useState();
	const [loading, setLoading] = useState(false);

	const [subComponentDetails, setSubComponentDetails] = useState();
	const [spareDetails, setSpareDetails] = useState();

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
	const getDetails = (phase) => {
		let endpoint =
			process.env.REACT_APP_BACKEND_URL +
			"/api/v1/subcomponent?subComponentId=" +
			subComponent;
		let setter = setSubComponentDetails;
		setSpareDetails();
		if (phase === "spare") {
			endpoint =
				process.env.REACT_APP_BACKEND_URL + "/api/v1/spare?spareId=" + spare;
			setter = setSpareDetails;
			setSubComponentDetails();
		}

		axios
			.get(endpoint)
			.then((response) => {
				console.log(response.data);
				setter(response.data);
			})
			.catch((error) => {
				toastMessage("error", error.message);
				console.log(error);
			});
	};
	const addMaterial = (phase) => {
		let endpoint = "";
		if (phase === "spare") {
			const params = {
				rigId: rig,
				componentId: component,
				subComponentId: subComponent,
				spareId: spare,
				quantity: quantity,
				user: user.email,
			};
			endpoint =
				process.env.REACT_APP_BACKEND_URL +
				"/api/v1/spare/add-quantity?" +
				new URLSearchParams(params).toString();
		}
		if (phase === "subcomponent") {
			const params = {
				rigId: rig,
				componentId: component,
				subComponentId: subComponent,
				quantity: quantity,
				user: user.email,
			};
			endpoint =
				process.env.REACT_APP_BACKEND_URL +
				"/api/v1/subcomponent/add-quantity?" +
				new URLSearchParams(params).toString();
		}
		if (
			!spare &&
			quantity &&
			!manufacturer.length &&
			vendor.length &&
			price.length
		) {
			alert("Please");
			return;
		}
		setLoading(true);

		axios
			.post(endpoint)
			.then((response) => {
				// setStatusMessage({ type: "success", data: response.data });
				toastMessage("success", "Added quantity");
				console.log(response.data);
				setLoading(false);
			})
			.catch((error) => {
				setStatusMessage({ type: "error", data: error.message });
				toastMessage("error", error.message);
				setLoading(false);
			});
	};

	const handleQuantity = (e) => {
		let val = e.target.value;
		if (val === "0") {
			val = 1;
		}
		setQuantity(parseInt(val));
	};

	const handlePrice = (e) => {
		let val = e.target.value;
		if (val === "0") {
			val = 1;
		}
		setPrice(parseFloat(val));
	};

	const handleSpareDetailsChange = (event) => {
		const { name, value } = event.target;
		setSpareDetails({
			...spareDetails,
			[name]: value,
		});
	};
	const handleSubComponentDetailsChange = (event) => {
		const { name, value } = event.target;
		setSubComponentDetails({
			...subComponentDetails,
			[name]: value,
		});
	};

	useEffect(() => {
		getList("rig", setRigList);
		getList("component", setComponentList);
		getList("subcomponent", setSubComponentList);
		getList("spare", setSpareList);
		getList("project", setProjectList);
		getList("manufacturer", setManufacturerList);
		getList("vendor", setVendorList);
		getList("usageType", setUsageTypeList);
		getList("category", setCategoryList);
	}, []);

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
				Add Materials To Rigs
			</Typography>
			<Divider />
			<Stack
				sx={{
					alignItems: "center",
					backgroundColor: "#e4eaf1",
					padding: "2rem",
				}}
			>
				<Stack
					sx={{
						padding: "1.5rem",
						border: "1px solid #d8dfe6",
						borderRadius: "8px",
						boxShadow:
							"rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;",
						backgroundColor: "white",
						minWidth: "50%",
					}}
					gap={2}
				>
					<Stack direction="row" gap={2} justifyContent="space-evenly">
						<Stack
							direction="row"
							gap={2}
							justifyContent="flex-start"
							alignItems="center"
							sx={{ minWidth: "25rem" }}
						>
							<FormControl size="small" fullWidth required>
								<InputLabel id="Rig-label">Select Rig</InputLabel>
								<Select
									labelId="Rig-label-Id"
									id="Rig"
									label="Rig"
									value={rig}
									onChange={(e) => setRig(e.target.value)}
								>
									{rigList.map((rig) => (
										<MenuItem value={rig.id} key={rig.id}>
											{rig.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<AddRig label="Add" />
						</Stack>
						<Stack
							direction="row"
							gap={2}
							justifyContent="flex-start"
							alignItems="center"
							sx={{ minWidth: "25rem" }}
						>
							<FormControl size="small" fullWidth required>
								<InputLabel id="Component-label">Select Component</InputLabel>
								<Select
									labelId="Component-label-Id"
									id="Component"
									label="Component"
									value={component}
									onChange={(e) => setComponent(e.target.value)}
								>
									{componentList.map((component) => (
										<MenuItem value={component.id} key={component.id}>
											{component.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<AddComponent />
						</Stack>
					</Stack>
					<Stack direction="row" gap={2}>
						<Stack
							direction="row"
							gap={2}
							justifyContent="flex-start"
							alignItems="center"
							width={1}
						>
							<FormControl size="small" required fullWidth>
								<InputLabel id="subComponent-label">
									Select Equipment
								</InputLabel>
								<Select
									labelId="subComponent-label"
									id="subComponent"
									label="Equipment"
									value={subComponent}
									onChange={(e) => setSubComponent(e.target.value)}
								>
									{subComponentList.map((subcomponent) => (
										<MenuItem value={subcomponent.id} key={subcomponent.id}>
											<Typography variant="inherit" noWrap>
												{subcomponent.name}
											</Typography>
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<AddSubComponent />
							<Button
								variant="contained"
								sx={{
									backgroundColor: "#112131",
									fontWeight: "bold",
									":hover": {
										backgroundColor: "#1e3a57",
										color: "white",
									},
								}}
								disabled={!(rig && component && subComponent)}
								onClick={() => getDetails("subComponent")}
							>
								Details
							</Button>
						</Stack>
						<Stack
							direction="row"
							gap={2}
							justifyContent="flex-start"
							alignItems="center"
							width={1}
						>
							<FormControl size="small" required fullWidth>
								<InputLabel id="spare-label">Select Spare</InputLabel>
								<Select
									labelId="spare-label"
									id="spare"
									label="spare"
									value={spare}
									onChange={(e) => setSpare(e.target.value)}
								>
									{spareList.map((spare) => (
										<MenuItem value={spare.id} key={spare.id}>
											<Typography variant="inherit" noWrap>
												{spare.name}
											</Typography>
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<AddSpare
								usageTypeList={usageTypeList}
								categoryList={categoryList}
							/>
							<Button
								variant="contained"
								sx={{
									backgroundColor: "#112131",
									fontWeight: "bold",
									":hover": {
										backgroundColor: "#1e3a57",
										color: "white",
									},
								}}
								disabled={!(rig && component && subComponent && spare)}
								onClick={() => getDetails("spare")}
							>
								Details
							</Button>
						</Stack>
					</Stack>
					{spareDetails && (
						<Stack gap={2}>
							<Divider>
								<Chip label="Spare Item Details" />
							</Divider>
							<TextField
								size="small"
								id="id"
								name="id"
								label="ID"
								variant="outlined"
								value={spareDetails.id}
								onChange={handleSpareDetailsChange}
								required
								InputProps={{
									readOnly: true,
								}}
								disabled
							/>
							<TextField
								size="small"
								id="name"
								name="name"
								label="Name"
								variant="outlined"
								value={spareDetails.name}
								onChange={handleSpareDetailsChange}
								required
								InputProps={{
									readOnly: true,
								}}
								disabled
							/>
							<TextField
								size="small"
								id="model"
								name="model"
								label="Model"
								variant="outlined"
								value={spareDetails.model}
								onChange={handleSpareDetailsChange}
								required
								InputProps={{
									readOnly: true,
								}}
								disabled
							/>
							<TextField
								multiline
								size="small"
								id="spec"
								name="spec"
								label="Specification"
								variant="outlined"
								value={
									spareDetails.specification ? spareDetails.specification : ""
								}
								onChange={handleSpareDetailsChange}
								required
								InputProps={{
									readOnly: true,
								}}
								disabled
							/>
							<TextField
								multiline
								size="small"
								id="description"
								name="description"
								label="Description"
								variant="outlined"
								value={spareDetails.description ? spareDetails.description : ""}
								onChange={handleSpareDetailsChange}
								required
								InputProps={{
									readOnly: true,
								}}
								disabled
							/>
							<TextField
								size="small"
								id="reorderPoint"
								label="Reorder Point"
								variant="outlined"
								type="number"
								required
								value={spareDetails.reorderPoint}
								onChange={handleSpareDetailsChange}
								inputProps={{
									min: 1,
									readOnly: true,
								}}
								disabled
							/>
							<Stack
								direction="row"
								gap={2}
								justifyContent="flex-start"
								alignItems="center"
								sx={{ minWidth: "25rem" }}
							>
								<FormControl fullWidth size="small" required disabled>
									<InputLabel id="material-label">Usage Type</InputLabel>
									<Select
										labelId="UsageType-label"
										id="UsageType"
										name="usageType"
										label="UsageType"
										value={spareDetails.usageType}
										onChange={handleSpareDetailsChange}
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
								{/* <AddMetadata metadata="usageType" /> */}
							</Stack>
							<Stack
								direction="row"
								gap={2}
								justifyContent="flex-start"
								alignItems="center"
								sx={{ minWidth: "25rem" }}
							>
								<FormControl fullWidth size="small" required disabled>
									<InputLabel id="material-label">Category</InputLabel>
									<Select
										labelId="category-label"
										id="category"
										label="category"
										value={spareDetails.category}
										onChange={handleSpareDetailsChange}
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
								{/* <AddMetadata metadata="category" /> */}
							</Stack>
						</Stack>
					)}
					{subComponentDetails && (
						<Stack gap={2}>
							<Divider>
								<Chip label="Equipment Details" />
							</Divider>
							<TextField
								size="small"
								id="id"
								name="id"
								label="ID"
								variant="outlined"
								value={subComponentDetails.id}
								onChange={handleSubComponentDetailsChange}
								required
								InputProps={{
									readOnly: true,
								}}
								disabled
							/>
							<TextField
								size="small"
								id="name"
								name="name"
								label="Name"
								variant="outlined"
								value={subComponentDetails.name}
								onChange={handleSubComponentDetailsChange}
								required
								InputProps={{
									readOnly: true,
								}}
								disabled
							/>
							<TextField
								size="small"
								id="model"
								name="model"
								label="Model"
								variant="outlined"
								value={subComponentDetails.model}
								onChange={handleSubComponentDetailsChange}
								required
								InputProps={{
									readOnly: true,
								}}
								disabled
							/>
							<TextField
								multiline
								size="small"
								id="spec"
								name="spec"
								label="Specification"
								variant="outlined"
								value={
									subComponentDetails.specification
										? subComponentDetails.specification
										: ""
								}
								onChange={handleSubComponentDetailsChange}
								required
								InputProps={{
									readOnly: true,
								}}
								disabled
							/>
							<TextField
								multiline
								size="small"
								id="description"
								name="description"
								label="Description"
								variant="outlined"
								value={
									subComponentDetails.description
										? subComponentDetails.description
										: ""
								}
								onChange={handleSubComponentDetailsChange}
								required
								InputProps={{
									readOnly: true,
								}}
								disabled
							/>
						</Stack>
					)}

					{(spareDetails || subComponentDetails) && (
						<>
							<Divider>
								<Chip label="Add Materials" />
							</Divider>
							<Stack direction="column" gap={2}>
								{/* <Stack
									direction="row"
									gap={2}
									justifyContent="flex-start"
									alignItems="center"
								>
									<FormControl fullWidth size="small" required>
										<InputLabel id="demo-simple-select-label">
											Manufacturer
										</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											label="Manufacturer"
											value={manufacturer}
											onChange={(e) => setManufacturer(e.target.value)}
										>
											{manufacturerList.map((manufacturer) => (
												<MenuItem value={manufacturer.id} key={manufacturer.id}>
													{manufacturer.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<AddManufacturer />
								</Stack>
								<Stack
									direction="row"
									gap={2}
									justifyContent="flex-start"
									alignItems="center"
								>
									<FormControl fullWidth size="small" required>
										<InputLabel id="demo-simple-select-label">
											Vendor
										</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											label="Vendor"
											value={vendor}
											onChange={(e) => setVendor(e.target.value)}
										>
											{vendorList.map((vendor) => (
												<MenuItem value={vendor.id} key={vendor.id}>
													{vendor.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<AddVendor />
								</Stack>
								<Stack
									direction="row"
									gap={2}
									justifyContent="flex-start"
									alignItems="center"
								>
									<FormControl fullWidth size="small" required>
										<InputLabel id="project-select-label">
											Associated Project
										</InputLabel>
										<Select
											labelId="project-select-label"
											id="project-select"
											label="Project"
											value={project}
											onChange={(e) => setProject(e.target.value)}
										>
											{projectList.map((project) => (
												<MenuItem value={project.id} key={project.id}>
													{project.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<AddProject />
								</Stack> */}
								<TextField
									size="small"
									id="Quantity"
									label="Quantity"
									variant="outlined"
									type="number"
									required
									inputProps={{
										min: 1,
									}}
									value={quantity}
									onChange={handleQuantity}
								/>
								{/* <TextField
									size="small"
									id="Price"
									label="Price (INR)"
									variant="outlined"
									type="number"
									required
									value={price}
									onChange={handlePrice}
									inputProps={{
										min: 1,
									}}
								/> */}
							</Stack>
							{/* <Stack alignItems="center" justifyContent="center">
								<DatePickerValue
									label="Entry Date"
									dateValue={dateOfPurchase}
									setDateValue={setDateOfPurchase}
								/>
							</Stack> */}
							<Stack gap={2} justifyContent="center">
								<Button
									variant="contained"
									sx={{
										backgroundColor: "#112131",
										fontWeight: "bold",
										":hover": {
											backgroundColor: "#1e3a57",
											color: "white",
										},
									}}
									onClick={() =>
										addMaterial(spareDetails ? "spare" : "subcomponent")
									}
									disabled={!quantity}
								>
									Add Material
								</Button>
								{statusMessage && (
									<Alert severity={statusMessage.type}>
										{statusMessage.data}
									</Alert>
								)}
							</Stack>
						</>
					)}
				</Stack>
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

export default AddInventory;
