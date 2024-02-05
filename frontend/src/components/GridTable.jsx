import { AgGridReact } from "ag-grid-react";

import { FastForward } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useCallback, useEffect, useMemo, useRef } from "react";

const GridTable = ({ rows, columnDefs }) => {
	const gridRef = useRef();
	const onGridReady = () => {
		const { api, columnApi } = gridRef.current;

		// api's will be null before grid initialised
		if (api == null || columnApi == null) {
			return;
		}

		api.sizeColumnsToFit();
	};
	const defaultColDef = useMemo(() => ({
		sortable: true,
		resizable: true,
		editable: false,
		floatingFilter: true,
		checkboxSelection: false,
		headerCheckboxSelection: false,
	}));
	const onBtnExport = useCallback(() => {
		gridRef.current.api.exportDataAsCsv();
	}, []);

	useEffect(() => {
		onGridReady();
	}, [rows, columnDefs]);

	return (
		<Box
			className="ag-theme-alpine"
			display="flex"
			flexDirection="column"
			gap={1}
			sx={{ height: "100%" }}
		>
			<Box alignSelf="flex-end">
				<Button
					variant="contained"
					size="small"
					color="inherit"
					onClick={onBtnExport}
				>
					Export Data
				</Button>
			</Box>

			<AgGridReact
				ref={gridRef}
				rowData={rows}
				columnDefs={columnDefs}
				defaultColDef={defaultColDef}
				onGridReady={onGridReady}
				animateRows={true} // Optional - set to 'true' to have rows animate when sorted
				rowSelection="multiple" // Options - allows click selection of rows
				pagination={true}
				paginationPageSize={20}
				paginationAutoPageSize={false}
				overlayLoadingTemplate={
					'<span class="ag-overlay-loading-center">Please wait!!! Your data is loading</span>'
				}
				overlayNoRowsTemplate={
					'<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">Could Not Fetch Data. Please retry</span>'
				}
			/>
		</Box>
	);
};

export default GridTable;
