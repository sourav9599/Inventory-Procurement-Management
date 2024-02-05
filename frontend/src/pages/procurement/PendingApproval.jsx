import { Box, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import GridTable from "../../components/GridTable";
import ProcessOptions from "../../components/ProcessOptions";
import AddQuotation from "../../components/AddModal/AddQuotation";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ViewQuotations from "../../components/ViewQuotations";
import dayjs from "dayjs";
import ViewComments from "../../components/ViewComments";

const PendingApproval = () => {
	const { session } = useAuth();
	const [columnDefs, setColumnDefs] = useState([]);
	const [rowData, setRowData] = useState([]);

	const fetchPendingApprovals = () => {
		axios
			.get(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/material-request/pending-approvals?groupName=" +
					session.accessToken.payload["cognito:groups"][0]
			)
			.then((response) => {
				console.log(response.data);
				setRowData(response.data);
			})
			.catch((error) => {
				console.log(error.message);
			});
	};
	const processOptions = (params) => {
		return <ProcessOptions data={params.data} />;
	};
	const addQuotations = (params) => {
		return (
			<ViewQuotations
				rigId={params.data.rigId}
				materialRequestId={params.data.materialRequestId}
				data={params.data}
			/>
		);
	};
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
	function viewComments(data) {
		return <ViewComments comments={data.comments} />;
	}

	function createGridSchema() {
		setColumnDefs([
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
			},
			{
				field: "materialPurchaseInformation",
				headerName: "Process Options",
				cellRenderer: (params) => processOptions(params),
			},
			{
				field: "material",
				headerName: "Quotations",
				cellRenderer: (params) => addQuotations(params),
			},
		]);
	}

	useEffect(() => {
		if (rowData.length) {
			createGridSchema();
		}
	}, [rowData]);
	useEffect(() => {
		fetchPendingApprovals();
	}, []);
	return (
		<div>
			<Typography
				variant="h4"
				component="h1"
				sx={{ fontWeight: "600", color: "#4f4f4f" }}
				gutterBottom
			>
				Pending Approval
			</Typography>
			<Divider />
			<Box sx={{ height: "80dvh", marginTop: "1rem" }}>
				<GridTable rows={rowData} columnDefs={columnDefs} />
			</Box>
		</div>
	);
};

export default PendingApproval;
