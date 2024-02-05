import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import GridTable from "../../components/GridTable";
import axios from "axios";
import toastMessage from "../../utils/ToastMessage";
import { useAuth } from "../../context/AuthContext";
import DownloadIcon from "@mui/icons-material/Download";
import ViewComments from "../../components/ViewComments";
import dayjs from "dayjs";

const MRDashboard = () => {
	const { session } = useAuth();
	const [columnDefs, setColumnDefs] = useState([]);
	const [rowData, setRowData] = useState([]);
	const groupName = session.accessToken.payload["cognito:groups"][0];

	const getAllMaterialRequests = () => {
		axios
			.get(process.env.REACT_APP_BACKEND_URL + "/api/v1/material-request")
			.then((response) => {
				setRowData(response.data);
			})
			.catch((err) => {
				toastMessage("error", err.message);
			});
	};
	function viewComments(data) {
		return <ViewComments comments={data.comments} />;
	}
	function workOrder(params) {
		const downloadWorkOrder = () => {
			const urlParams = {
				rigId: params.data.rigId,
				materialRequestId: params.data.materialRequestId,
				materialType: params.data.materialType,
				materialId: params.data.materialId,
				rigName: params.data.rigName,
				componentName: params.data.componentName,
				quantity: params.data.quantity,
			};
			axios
				.get(
					process.env.REACT_APP_BACKEND_URL +
						"/api/v1/generate/work-order?" +
						new URLSearchParams(urlParams).toString(),
					{
						responseType: "arraybuffer",
					}
				)
				.then((response) => {
					const fileUrl = window.URL.createObjectURL(
						new Blob([response.data], { type: "application/pdf" })
					);
					const a = document.createElement("a");
					a.href = fileUrl;
					a.download =
						"Work_Order_" +
						params.data.rigName +
						"_" +
						params.data.materialName +
						".pdf";
					a.style.display = "none";
					document.body.appendChild(a);
					a.click();
					window.URL.revokeObjectURL(fileUrl);
					document.body.removeChild(a);
					toastMessage(
						"success",
						"Downloaded Work Order for " + params.data.materialRequestId
					);
				})
				.catch((error) => {
					toastMessage("error", error.response.data.message);
				});
		};
		return (
			<Stack>
				<Button
					onClick={downloadWorkOrder}
					disabled={!(params.data.currentStatus === "APPROVED")}
				>
					<DownloadIcon />
				</Button>
			</Stack>
		);
	}

	const formatDate = (params) => {
		return dayjs(params.value).format("DD-MM-YYYY");
	};

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

	function createGridSchema() {
		let columns = [
			{
				field: "materialId",
				headerName: "Material Id",
				filter: "agTextColumnFilter",
			},
			{
				field: "materialName",
				headerName: "Material Name",
				filter: "agTextColumnFilter",
			},
			{
				field: "rigName",
				headerName: "Rig Name",
				filter: "agTextColumnFilter",
			},
			{
				field: "quantity",
				headerName: "Quantity",
				filter: "agNumberColumnFilter",
			},
			{
				field: "currentStatus",
				headerName: "currentStatus",
				filter: "agTextColumnFilter",
			},
			{
				field: "deadline",
				headerName: "Deadline",
				filter: "agDateColumnFilter",
				valueFormatter: formatDate,
				filterParams: filterParams,
			},
			{
				field: "createdDate",
				headerName: "Created Date",
				filter: "agDateColumnFilter",
				valueFormatter: formatDate,
				filterParams: filterParams,
			},
			{
				field: "pendingApprovalGroup",
				headerName: "pendingApprovalGroup",
				filter: "agTextColumnFilter",
			},
			{
				field: "comments",
				headerName: "comments",
				cellRenderer: (params) => viewComments(params.data),
				cellStyle: { textAlign: "center" },
			},
		];
		if (groupName === "Finance") {
			columns.push({
				field: "Work Order",
				headerName: "Work Order",
				cellRenderer: (params) => workOrder(params),
				cellStyle: { textAlign: "center" },
			});
		}
		setColumnDefs(columns);
	}
	useEffect(() => {
		getAllMaterialRequests();
		createGridSchema();
	}, []);
	return (
		<div>
			<Typography
				variant="h4"
				component="h1"
				sx={{ fontWeight: "600", color: "#4f4f4f" }}
				gutterBottom
			>
				MR Dashboard
			</Typography>
			<Divider />
			<Box sx={{ height: "80dvh", marginTop: "5px" }}>
				<GridTable rows={rowData} columnDefs={columnDefs} />
			</Box>
		</div>
	);
};

export default MRDashboard;
