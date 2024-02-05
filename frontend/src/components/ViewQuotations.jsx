import CloseIcon from "@mui/icons-material/Close";
import {
	Alert,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import dayjs from "dayjs";
import MaterialReactTable from "material-react-table";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toastMessage from "../utils/ToastMessage";
import AddQuotation from "./AddModal/AddQuotation";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1),
	},
}));

const ViewQuotations = ({ rigId, materialRequestId, data }) => {
	const { session } = useAuth();
	const [open, setOpen] = useState(false);
	const [columnDefs, setColumnDefs] = useState([
		{
			accessorKey: "id",
			header: "id",
		},
		{
			id: "timestamp",
			accessorFn: (originalRow) =>
				dayjs(originalRow.timestamp).format("DD-MM-YYYY HH:mm:ss"),
			header: "timestamp",
		},
		{
			accessorKey: "vendorName",
			header: "vendorName",
		},
		{
			accessorKey: "price",
			header: "Price",
		},
		{
			accessorKey: "tax",
			header: "Tax",
		},
		{
			id: "deliveryDate",
			accessorFn: (originalRow) =>
				dayjs(originalRow.deliveryDate).format("DD-MM-YYYY"),
			header: "deliveryDate",
		},
		{
			accessorKey: "documentPath",
			header: "Attachment",
			Cell: ({ cell }) => (
				<Button
					variant="contained"
					onClick={() => downloadAttachment(cell.getValue())}
				>
					download
				</Button>
			),
		},
	]);
	const [rowData, setRowData] = useState([]);
	const [rowSelection, setRowSelection] = useState({});
	const [acceptedQuote, setAcceptedQuote] = useState();
	const handleClose = () => {
		setOpen(false);
	};
	const handleOpen = () => {
		setRowData([]);
		setRowSelection({});
		fetchQuotations();
		setOpen(true);
	};
	const userGroup = session.accessToken.payload["cognito:groups"][0];

	const downloadAttachment = (path) => {
		const params = {
			path: path,
		};
		axios
			.get(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/quotation/downloadQuoteDocument?" +
					new URLSearchParams(params).toString(),
				{
					responseType: "arraybuffer",
				}
			)
			.then((response) => {
				const fileUrl = window.URL.createObjectURL(new Blob([response.data]), {
					type: "application/pdf",
				});
				const a = document.createElement("a");
				a.href = fileUrl;
				a.download = path;
				a.style.display = "none";
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(fileUrl);
				document.body.removeChild(a);
			})
			.catch((error) => {
				toastMessage("error", error.response.data.message);
			});
	};
	const fetchQuotations = () => {
		const params = {
			rigId,
			materialRequestId,
		};
		axios
			.get(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/quotation?" +
					new URLSearchParams(params).toString()
			)
			.then((response) => {
				console.log(response.data);
				setRowData(response.data.quotationList);
				setAcceptedQuote(response.data.acceptedQuoteId);
			})
			.catch((error) => {
				toastMessage("error", error.message);
			});
	};
	const saveAcceptedQuote = () => {
		const indexList = Object.keys(rowSelection);
		const selected = indexList.map((index) => rowData[parseInt(index)]);
		const params = {
			rigId,
			materialRequestId,
			quoteId: selected[0].id,
		};
		axios
			.post(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/quotation/acceptedQuote?" +
					new URLSearchParams(params).toString()
			)
			.then(() => {
				toastMessage("success", "Saved Accepted Quote");
				window.location.reload();
			})
			.catch(() => {
				toastMessage("error", "Failed to save accepted Quote");
			});
	};
	return (
		<div>
			<Stack
				direction="row"
				justifyContent="center"
				alignItems="center"
				marginTop="5px"
			>
				<Button
					variant="contained"
					color="primary"
					size="small"
					onClick={handleOpen}
				>
					view
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
					{"Quotation Details"}
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
					{userGroup === "Procurement" && (
						<Stack
							direction="row"
							justifyContent="flex-end"
							gap={2}
							marginBottom={2}
						>
							<AddQuotation
								rigId={rigId}
								materialRequestId={materialRequestId}
								data={data}
							/>
							<Button
								variant="contained"
								onClick={saveAcceptedQuote}
								disabled={!Object.keys(rowSelection).length}
							>
								Accept Quotation
							</Button>
						</Stack>
					)}
					{acceptedQuote && (
						<Stack marginBottom={1} marginTop={1}>
							<Alert severity="success">
								Accepted Quote ID: {acceptedQuote}
							</Alert>
						</Stack>
					)}
					<MaterialReactTable
						columns={columnDefs}
						data={rowData}
						enableRowSelection={
							userGroup === "Procurement"
								? true
								: acceptedQuote
								? (row) => row.original.id === acceptedQuote
								: false
						}
						enableMultiRowSelection={false}
						onRowSelectionChange={setRowSelection}
						state={{ rowSelection }}
					/>
				</DialogContent>
			</BootstrapDialog>
		</div>
	);
};

export default ViewQuotations;
