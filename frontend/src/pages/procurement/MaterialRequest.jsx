import {
	Backdrop,
	Box,
	Button,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import DatePickerValue from "../../components/DatePickerValue";

const MaterialRequest = () => {
	const [rigList, setRigList] = useState([]);
	const [materialList, setMaterialList] = useState([]);
	const [rig, setRig] = useState("");
	const [material, setMaterial] = useState("");
	const [quantity, setQuantity] = useState();
	const [dateOfRequest, setDateOfRequest] = useState(dayjs());

	const handleQuantity = (e) => {
		let val = e.target.value;
		if (val === "0") {
			val = 1;
		}
		setQuantity(parseInt(val));
	};
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
			}}
			gap={2}
		>
			<Typography variant="h4" component="h1" gutterBottom>
				Request For Material
			</Typography>
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
						width: "25rem",
						border: "1px solid #d8dfe6",
						borderRadius: "8px",
						boxShadow:
							"rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;",
						backgroundColor: "white",
					}}
					gap={2}
				>
					<Stack
						direction="row"
						gap={2}
						justifyContent="flex-start"
						alignItems="center"
						sx={{ maxWidth: "25rem" }}
					>
						<FormControl size="small" fullWidth required>
							<InputLabel id="Rig-label">Rig Name</InputLabel>
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
						{/* <AddRig label="Add" /> */}
					</Stack>
					{rig && (
						<>
							<Stack direction="column" gap={2} sx={{ maxWidth: "25rem" }}>
								<Stack
									direction="row"
									gap={2}
									justifyContent="flex-start"
									alignItems="center"
									sx={{ maxWidth: "25rem" }}
								>
									<FormControl fullWidth size="small" required>
										<InputLabel id="material-label">Material</InputLabel>
										<Select
											labelId="material-label"
											id="material"
											label="Material"
											value={material}
											onChange={(e) => setMaterial(e.target.value)}
										>
											{materialList.map((material) => (
												<MenuItem value={material.id} key={material.id}>
													{material.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Stack>
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
							<Stack sx={{ maxWidth: "25rem" }}>
								<DatePickerValue
									label="Date Of Purchase"
									dateValue={dateOfRequest}
									setDateValue={setDateOfRequest}
								/>
							</Stack>
							<Stack sx={{ maxWidth: "25rem" }} gap={2}>
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
								>
									Add Material
								</Button>
							</Stack>
						</>
					)}
				</Stack>
			</Stack>
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</Box>
	);
};

export default MaterialRequest;
