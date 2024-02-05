import {
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
import React, { useEffect, useState } from "react";
import DatePickerValue from "../../components/DatePickerValue";
import AddProject from "../../components/AddModal/AddProject";
import AddManufacturer from "../../components/AddModal/AddManufacturer";
import toastMessage from "../../utils/ToastMessage";
import axios from "axios";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import AddVendor from "../../components/AddModal/AddVendor";
import FileUpload from "../../components/FileUpload";
const materialTypeList = ["Equipment", "Spare"];
const Reimbursement = () => {
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
	const [quantity, setQuantity] = useState("");
	const [comments, setComments] = useState("");
	const [loading, setLoading] = useState(false);

	const [vendor, setVendor] = useState("");
	const [vendorList, setVendorList] = useState([]);
	const [totalPrice, setTotalPrice] = useState("");
	const [tax, setTax] = useState("");
	const [deliveryDate, setDeliveryDate] = useState(dayjs());
	const [uploadedFile, setUploadedFile] = useState(null);
	const [openQuotationView, setOpenQuotationView] = useState(false);
	const [materialRequestId, setMaterialRequestId] = useState("");
	const [quotationId, setQuotationId] = useState("");

	const getRecommendedVendor = () => {
		let purchaseInfoId = rig + "_" + component + "_" + subComponent;
		let materialId = spare;
		if (materialType === "Equipment") {
			purchaseInfoId = rig + "_" + component;
			materialId = subComponent;
		}
		const params = {
			materialId: materialId,
			purchaseInfoId: purchaseInfoId,
		};
		axios
			.get(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/vendor/recommended?" +
					new URLSearchParams(params).toString()
			)
			.then((response) => {
				setVendorList(response.data);
			})
			.catch((error) => {
				console.log(error);
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
		setTotalPrice(parseFloat(val));
	};
	const handleTax = (e) => {
		let val = e.target.value;
		if (val === "0") {
			val = 1;
		}
		setTax(parseFloat(val));
	};

	const addQuotation = () => {
		const formData = new FormData();
		formData.append("file", uploadedFile);
		const vendorName = vendorList.filter((val) => val.id === vendor)[0].name;
		const params = {
			rigId: rig,
			materialRequestId: materialRequestId,
			vendorId: vendor,
			vendorName: vendorName,
			price: totalPrice,
			tax: tax,
			deliveryDate: dayjs(deliveryDate).valueOf(),
		};

		axios
			.post(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/quotation?" +
					new URLSearchParams(params).toString(),
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			)
			.then((response) => {
				setQuotationId(response.data);
				saveAcceptedQuote();
				toastMessage("success", "Successfully added Quotation");
			})
			.catch((error) => {
				toastMessage("error", error.message);
			});
	};
	const saveAcceptedQuote = () => {
		const params = {
			rigId: rig,
			materialRequestId: materialRequestId,
			quoteId: quotationId,
		};
		axios
			.post(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/quotation/acceptedQuote?" +
					new URLSearchParams(params).toString()
			)
			.then(() => {
				toastMessage("success", "Saved Accepted Quote");
			})
			.catch(() => {
				toastMessage("error", "Failed to save accepted Quote");
			});
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
			deadline: dayjs(deliveryDate).valueOf(),
			pendingApprovalGroup: "Procurement",
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
			.then((response) => {
				toastMessage("success", "Successfully created material request!!");
				setLoading(false);
				setMaterialRequestId(response.data);
				addQuotation();
			})
			.catch((err) => {
				toastMessage("error", err.message);
				setLoading(false);
			});
	};

	const createReimburseRequest = async () => {
		try {
			// Make the first Axios request
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
				materialName:
					materialType === "Equipment" ? subComponentName : spareName,
				deadline: dayjs(deliveryDate).valueOf(),
				pendingApprovalGroup: "Procurement",
				manufacturerId: manufacturer,
				materialType: materialType,
				projectId: project,
			};
			console.log(subComponentName, spareName);
			const response1 = await axios.post(
				process.env.REACT_APP_BACKEND_URL + "/api/v1/material-request/spare",
				body
			);
			setMaterialRequestId(response1.data);

			// Use the result of the first request to make the second request
			const formData = new FormData();
			formData.append("file", uploadedFile);
			const vendorName = vendorList.filter((val) => val.id === vendor)[0].name;
			const params = {
				rigId: rig,
				materialRequestId: materialRequestId,
				vendorId: vendor,
				vendorName: vendorName,
				price: totalPrice,
				tax: tax,
				deliveryDate: dayjs(deliveryDate).valueOf(),
			};

			const response2 = await axios.post(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/quotation?" +
					new URLSearchParams(params).toString(),
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			setQuotationId(response2.data);

			// Use the result of the second request to make the third request
			const params3 = {
				rigId: rig,
				materialRequestId: materialRequestId,
				quoteId: quotationId,
			};
			axios.post(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/quotation/acceptedQuote?" +
					new URLSearchParams(params3).toString()
			);
			toastMessage("success", "Created Reimbursement Request");
			setLoading(false);
		} catch (error) {
			toastMessage("error", error);
			setLoading(false);
		}
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
			<Box>
				<Typography
					variant="h4"
					component="h1"
					sx={{ fontWeight: "600", color: "#4f4f4f" }}
					gutterBottom
				>
					Reimbursement Request
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
					<Divider>
						<Chip label="Material Details" />
					</Divider>
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
							onClick={() => {
								getRecommendedVendor();
								setOpenQuotationView(true);
							}}
							disabled={
								!(
									manufacturer &&
									rig &&
									project &&
									quantity &&
									component &&
									materialType
								)
							}
						>
							Add Quotation Details
						</Button>
					</Stack>
					{openQuotationView && (
						<>
							<Divider>
								<Chip label="Quotation Details" />
							</Divider>
							<Stack gap={2}>
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
								<DatePickerValue
									label="Delivery Date"
									dateValue={deliveryDate}
									setDateValue={setDeliveryDate}
								/>

								<TextField
									size="small"
									id="Price"
									label="Price (INR)"
									variant="outlined"
									type="number"
									required
									inputProps={{
										min: 1,
									}}
									value={totalPrice}
									onChange={handlePrice}
								/>
								<TextField
									size="small"
									id="Tax"
									label="Tax (INR)"
									variant="outlined"
									type="number"
									required
									inputProps={{
										min: 1,
									}}
									value={tax}
									onChange={handleTax}
								/>
								<FileUpload
									uploadedFile={uploadedFile}
									setUploadedFile={setUploadedFile}
								/>
								<TextField
									value={comments}
									label="Reason for Reimbursement"
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
									onClick={createReimburseRequest}
									disabled={
										!(
											vendor &&
											deliveryDate &&
											totalPrice &&
											tax &&
											uploadedFile &&
											comments
										)
									}
								>
									Create Reimbursement Request
								</Button>
							</Stack>
						</>
					)}

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

export default Reimbursement;
