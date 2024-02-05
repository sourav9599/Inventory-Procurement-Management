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
import { useEffect, useState } from "react";
import toastMessage from "../../utils/ToastMessage";
import AddVendor from "./AddVendor";
import DatePickerValue from "../DatePickerValue";
import dayjs from "dayjs";
import FileUpload from "../FileUpload";

export default function AddQuotation({ rigId, materialRequestId, data }) {
	const [open, setOpen] = useState(false);
	const [vendor, setVendor] = useState("");
	const [vendorList, setVendorList] = useState([]);
	const [totalPrice, setTotalPrice] = useState("");
	const [tax, setTax] = useState("");
	const [deliveryDate, setDeliveryDate] = useState(dayjs());
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);
	const [uploadedFile, setUploadedFile] = useState(null);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
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
			rigId: rigId,
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
			.then(() => {
				toastMessage("success", "Successfully added Quotation");
				window.location.reload();
			})
			.catch((error) => {
				toastMessage("error", error.message);
			});
	};
	const getList = () => {
		let purchaseInfoId =
			data.rigId + "_" + data.componentId + "_" + data.subComponentId;
		if (data.materialType === "Equipment") {
			purchaseInfoId = data.rigId + "_" + data.componentId;
		}
		const params = {
			materialId: data.materialId,
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

	useEffect(() => {
		getList();
	}, [open]);

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
				<DialogTitle id="alert-dialog-title">Add New Quotation</DialogTitle>
				<DialogContent>
					<Stack gap={2}>
						<Stack
							direction="row"
							gap={2}
							justifyContent="flex-start"
							alignItems="center"
						>
							<FormControl fullWidth size="small" required>
								<InputLabel id="demo-simple-select-label">Vendor</InputLabel>
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
						{error && <Alert severity="error"> {error} </Alert>}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={
							!(vendor && deliveryDate && totalPrice && tax && uploadedFile)
						}
						variant="contained"
						onClick={addQuotation}
					>
						Add Quotation
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
