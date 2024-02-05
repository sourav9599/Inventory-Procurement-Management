import {
	Backdrop,
	Box,
	Button,
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
import { useState, useEffect } from "react";
import DatePickerValue from "../../components/DatePickerValue";
import dayjs from "dayjs";
import AddManufacturer from "../../components/AddModal/AddManufacturer";
import AddProject from "../../components/AddModal/AddProject";
import { useAuth } from "../../context/AuthContext";
import toastMessage from "../../utils/ToastMessage";
const materialTypeList = ["Equipment", "Spare"];
const CreateMR = () => {
	const { session, user } = useAuth();
	const [rigList, setRigList] = useState([]);
	const [componentList, setComponentList] = useState([]);
	const [subComponentList, setSubComponentList] = useState([]);
	const [projectList, setProjectList] = useState([]);

	const [manufacturerList, setManufacturerList] = useState([]);

	const [spareList, setSpareList] = useState([]);
	const [rig, setRig] = useState("");
	const [materialType, setMaterialType] = useState("");
	const [component, setComponent] = useState("");
	const [subComponent, setSubComponent] = useState("");
	const [spare, setSpare] = useState("");
	const [project, setProject] = useState("");
	const [manufacturer, setManufacturer] = useState("");
	const [deadline, setDeadline] = useState(dayjs());
	const [quantity, setQuantity] = useState("");
	const [comments, setComments] = useState("");
	const [loading, setLoading] = useState(false);

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

	const handleQuantity = (e) => {
		let val = e.target.value;
		if (val === "0") {
			val = 1;
		}
		setQuantity(parseInt(val));
	};

	const createMR = () => {
		setLoading(true);
		let spareName = "";
		const subComponentName = subComponentList.filter(
			(val) => val.id === subComponent
		)[0].name;
		if (spare) {
			spareName = spareList.filter((val) => val.id === spare)[0].name;
		}

		const body = {
			rigId: rig,
			componentId: component,
			subComponentId: subComponent,
			quantity: quantity,
			comments: [
				{
					user: user.email,
					group: session.accessToken.payload["cognito:groups"][0],
					timestamp: dayjs().valueOf(),
					message: comments,
				},
			],
			materialId: materialType === "Equipment" ? subComponent : spare,
			materialName: materialType === "Equipment" ? subComponentName : spareName,
			deadline: dayjs(deadline).valueOf(),
			pendingApprovalGroup: session.accessToken.payload["cognito:groups"][0],
			manufacturerId: manufacturer,
			materialType: materialType,
			projectId: project,
		};
		console.log(subComponentName, spareName);
		axios
			.post(
				process.env.REACT_APP_BACKEND_URL + "/api/v1/material-request/spare",
				body
			)
			.then(() => {
				toastMessage("success", "Successfully created material request!!");
				setLoading(false);
				window.location.reload();
			})
			.catch((err) => {
				toastMessage("error", err.message);
				setLoading(false);
			});
	};

	useEffect(() => {
		getList("rig", setRigList);
		getList("component", setComponentList);
		getList("subcomponent", setSubComponentList);
		getList("spare", setSpareList);
		getList("project", setProjectList);
		getList("manufacturer", setManufacturerList);
	}, []);
	return (
		<Stack gap={2}>
			<Box width="20%">
				<Typography
					variant="h4"
					component="h1"
					sx={{ fontWeight: "600", color: "#4f4f4f" }}
					gutterBottom
				>
					New Material Request
				</Typography>
			</Box>
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
					<Stack
						direction="row"
						justifyContent="center"
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
								onChange={(e) => setRig(e.target.value)}
							>
								{rigList.map((rig) => (
									<MenuItem value={rig.id} key={rig.id}>
										{rig.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

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
							<InputLabel id="Select-Component-input-label">
								Select Type
							</InputLabel>
							<Select
								labelId="Select-type-label"
								id="Select-type"
								value={materialType}
								label="Material Type"
								onChange={(e) => setMaterialType(e.target.value)}
							>
								{materialTypeList.map((type) => (
									<MenuItem value={type} key={type}>
										{type}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Stack>
					<Stack
						direction="row"
						gap={2}
						justifyContent="center"
						alignItems="center"
					>
						{materialType === "Equipment" && (
							<FormControl sx={{ minWidth: "20%" }} size="small">
								<InputLabel id="select-rig-input-label">
									Select Sub Component
								</InputLabel>
								<Select
									labelId="Select-Sub-Component-label"
									id="Select-Sub-Component"
									value={subComponent}
									label="Select Sub Component"
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
						)}
						{materialType === "Spare" && (
							<>
								<FormControl sx={{ minWidth: "20%" }} size="small">
									<InputLabel id="select-rig-input-label">
										Select Sub Component
									</InputLabel>
									<Select
										labelId="Select-Sub-Component-label"
										id="Select-Sub-Component"
										value={subComponent}
										label="Select Sub Component"
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
								<FormControl sx={{ minWidth: "20%" }} size="small">
									<InputLabel id="select-rig-input-label">
										Select Spare
									</InputLabel>
									<Select
										labelId="Select-Spare-label"
										id="Select-Spare"
										value={spare}
										label="Select Spare"
										onChange={(e) => setSpare(e.target.value)}
									>
										{spareList.map((spare) => (
											<MenuItem value={spare.id} key={spare.id}>
												{spare.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</>
						)}
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
					</Stack>
					<Stack
						direction="row"
						gap={2}
						justifyContent="center"
						alignItems="center"
					>
						<Stack
							direction="row"
							gap={2}
							justifyContent="flex-start"
							alignItems="center"
							minWidth="20rem"
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
							minWidth="20rem"
						>
							<FormControl fullWidth size="small" required>
								<InputLabel id="demo-simple-select-label">Project</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="Project"
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
						</Stack>
					</Stack>
					<Stack
						direction="row"
						gap={2}
						justifyContent="center"
						alignItems="center"
					>
						<DatePickerValue
							label="Deadline Date"
							dateValue={deadline}
							setDateValue={setDeadline}
						/>

						<TextField
							value={comments}
							label="Comments"
							required
							onChange={(e) => setComments(e.target.value)}
						/>
					</Stack>
					<Stack gap={2} justifyContent="center" alignItems="center">
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
							onClick={createMR}
							disabled={
								!(
									manufacturer &&
									rig &&
									project &&
									quantity &&
									component &&
									materialType &&
									deadline &&
									comments
								)
							}
						>
							Create Material Request
						</Button>
					</Stack>
					<Backdrop
						sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
						open={loading}
					>
						<CircularProgress color="inherit" />
					</Backdrop>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default CreateMR;
