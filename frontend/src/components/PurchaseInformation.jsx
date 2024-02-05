import CloseIcon from "@mui/icons-material/Close";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import GridTable from "./GridTable";
import axios from "axios";
import toastMessage from "../utils/ToastMessage";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1),
	},
}));

export default function PurchaseInformation({
	materialData,
	rigId,
	componentId,
	subComponentId,
}) {
	const [open, setOpen] = useState(false);
	const [columnDefs, setColumnDefs] = useState([]);
	const [rowData, setRowData] = useState([]);
	const [purchaseInfoList, setPurchaseInfoList] = useState([]);

	const handleClose = () => {
		setOpen(false);
	};

	const getPurchaseInfo = () => {
		setRowData([]);
		const purchaseInfoId =
			rigId + "_" + componentId + "_" + subComponentId + "_" + materialData.id;
		axios
			.get(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/purchaseInfo?purchaseInfoId=" +
					purchaseInfoId
			)
			.then((response) => {
				setPurchaseInfoList(response.data);
				setOpen(true);
			})
			.catch((err) => {
				toastMessage("error", err.messaage);
			});
	};
	const filterParams = {
		comparator: (filterLocalDateAtMidnight, cellValue) => {
			let dateAsString = cellValue;
			if (dateAsString == null) return -1;
			let dateParts = dateAsString.split("/");
			let cellDate = new Date(
				Number(dateParts[2]),
				Number(dateParts[1]) - 1,
				Number(dateParts[0])
			);
			if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
				return 0;
			}
			if (cellDate < filterLocalDateAtMidnight) {
				return -1;
			}
			if (cellDate > filterLocalDateAtMidnight) {
				return 1;
			}
			return 0;
		},
		minValidYear: 2000,
		// maxValidYear: 2021,
		inRangeFloatingFilterDateFormat: "Do MMM YYYY",
	};

	function createGridSchema() {
		setRowData(
			purchaseInfoList.map((purchase) => {
				return { ...purchase, date: dayjs(purchase.date).format("DD/MM/YYYY") };
			})
		);
		setColumnDefs([
			{
				field: "date",
				headerName: "Date Of Purchase",
				filter: "agDateColumnFilter",
				filterParams: filterParams,
			},
			{
				field: "manufacturerName",
				headerName: "Manufacturer",
				filter: "agTextColumnFilter",
			},
			{
				field: "vendorName",
				headerName: "Vendor",
				filter: "agTextColumnFilter",
			},
			{
				field: "quantity",
				headerName: "Quantity",
				filter: "agNumberColumnFilter",
			},
			{
				field: "price",
				headerName: "Price (INR)",
				filter: "agNumberColumnFilter",
			},
			{
				field: "projectAssociatedName",
				headerName: "Project Associated",
				filter: "agTextColumnFilter",
			},
		]);
	}
	useEffect(() => {
		if (purchaseInfoList.length) {
			createGridSchema();
		}
	}, [purchaseInfoList]);

	return (
		<div>
			<Stack
				direction="row"
				justifyContent="center"
				alignItems="center"
				marginTop="4px"
			>
				<Button
					variant="contained"
					color="success"
					onClick={getPurchaseInfo}
					size="small"
				>
					View
				</Button>
			</Stack>

			<BootstrapDialog
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={open}
				fullWidth
				maxWidth="lg"
			>
				<DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
					{"Purchase Information Of Material: " + materialData.name}
				</DialogTitle>
				<IconButton
					aria-label="close"
					onClick={handleClose}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
				<DialogContent dividers>
					<Box sx={{ height: "70dvh" }}>
						<GridTable rows={rowData} columnDefs={columnDefs} />
					</Box>
				</DialogContent>
			</BootstrapDialog>
		</div>
	);
}
