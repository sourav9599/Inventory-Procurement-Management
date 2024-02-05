import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import GridTable from "./GridTable";
import axios from "axios";
import toastMessage from "../utils/ToastMessage";
import dayjs from "dayjs";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1),
	},
}));
const LogsInfo = ({ materialName, logId }) => {
	const filterParams = {
		comparator: (filterLocalDateAtMidnight, cellValue) => {
			let dateAsString = dayjs(cellValue).format("DD/MM/YYYY");
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
	const formatTimeStamp = (params) => {
		return dayjs(params.value).format("DD-MM-YYYY HH:mm:ss");
	};
	const [open, setOpen] = useState(false);
	const [columnDefs, setColumnDefs] = useState([
		{
			field: "timestamp",
			headerName: "Time Stamp",
			filter: "agDateColumnFilter",
			valueFormatter: formatTimeStamp,
			filterParams: filterParams,
		},
		{
			field: "actionType",
			headerName: "Action",
			filter: "agTextColumnFilter",
		},
		{
			field: "user",
			headerName: "User",
			filter: "agTextColumnFilter",
		},
		{
			field: "quantity",
			headerName: "Quantity",
			filter: "agNumberColumnFilter",
		},
		{
			field: "logMessage",
			headerName: "Log Message",
			filter: "agTextColumnFilter",
			wrapText: true,
			autoHeight: true,
			width: 550,
		},
	]);
	const [rowData, setRowData] = useState([]);

	const getLogInfo = () => {
		setRowData([]);

		axios
			.get(process.env.REACT_APP_BACKEND_URL + "/api/v1/logs?logId=" + logId)
			.then((response) => {
				setRowData(response.data);
				setOpen(true);
			})
			.catch((err) => {
				toastMessage("error", err.messaage);
			});
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<div>
			<Stack direction="row" justifyContent="center" alignItems="center">
				<Button variant="contained" color="success" onClick={getLogInfo}>
					Logs
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
					{"Log Information Of " + materialName}
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
};

export default LogsInfo;
