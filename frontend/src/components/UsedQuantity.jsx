import {
	Alert,
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const UsedQuantity = ({ quantityList, rigId, componentId, subComponentId }) => {
	const [data, setData] = useState([
		{
			id: "",
			usedQuantity: 0,
		},
	]);
	const { user } = useAuth();
	const [apiResults, setApiResults] = useState({});
	const [totalQuantity, setTotalQuantity] = useState(0);
	const [comment, setComment] = useState("");

	const handleApiCalls = async () => {
		const fetchApiData = async (data) => {
			try {
				const params = {
					rigId: rigId,
					componentId: componentId,
					subComponentId: subComponentId,
					spareId: data.id,
					quantity: data.usedQuantity,
					comment: comment,
					user: user.email,
				};
				await axios.post(
					process.env.REACT_APP_BACKEND_URL +
						"/api/v1/spare/remove-quantity?" +
						new URLSearchParams(params).toString()
				);

				setApiResults((prevResults) => ({
					...prevResults,
					[data.id]: "success",
				}));
			} catch (error) {
				setApiResults((prevResults) => ({
					...prevResults,
					[data.id]: error.message,
				}));
			}
		};

		data.forEach((data) => {
			fetchApiData(data);
		});
	};

	const handleChangeManf = (e, index) => {
		const val = [...data];
		val[index]["id"] = e.target.value;
		setData(val);
	};
	const handleQuantity = (e, index) => {
		const eventVal = e.target.value;
		const val = [...data];
		if (eventVal < 0) {
			val[index]["usedQuantity"] = 0;
		} else {
			val[index]["usedQuantity"] = parseInt(eventVal);
		}

		setData(val);
	};

	const handleDelete = (index) => {
		const val = [...data];
		val.splice(index, 1);
		setData(val);
	};

	const handleAdd = () => {
		setData([
			...data,
			{
				id: "",
				usedQuantity: 0,
			},
		]);
	};
	console.log(data);
	useEffect(() => {
		setData([
			{
				id: "",
				usedQuantity: 0,
			},
		]);
	}, [quantityList]);

	useEffect(() => {
		let total = 0;
		data.forEach((item) => {
			total = total + item.usedQuantity;
		});
		setTotalQuantity(total);
	}, [data]);

	return (
		<Box display={"flex"} sx={{ flexDirection: "column", gap: "1rem" }}>
			{data.map((value, index) => {
				return (
					<Stack key={index}>
						<Stack direction={"row"} gap={2} sx={{ marginBottom: "1rem" }}>
							<FormControl fullWidth size="small">
								<InputLabel id="demo-simple-select-label">Spare</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={value.id}
									label="Spare"
									onChange={(e) => handleChangeManf(e, index)}
								>
									{quantityList.map((item) => (
										<MenuItem value={item.id} key={item.id}>
											{item.id + "-" + item.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<TextField
								size="small"
								variant="outlined"
								type="number"
								value={value.usedQuantity}
								inputProps={{
									min: 1,
								}}
								onChange={(e) => handleQuantity(e, index)}
							/>
							{/* <IconButton
								onClick={(index) => handleDelete(index)}
								variant="contained"
								color="error"
								size="small"
							>
								<DeleteIcon />
							</IconButton> */}
						</Stack>

						{apiResults[value.id] &&
							(apiResults[value.id] === "success" ? (
								<Alert severity="success">
									{" "}
									Successfully removed Quantity!
								</Alert>
							) : (
								<Alert severity="error"> {apiResults[value.id]}</Alert>
							))}
					</Stack>
				);
			})}
			{/* <Typography variant="h6" sx={{ fontWeight: "700" }}>
				Removed Quantity: {totalQuantity}
			</Typography> */}
			<TextField
				multiline
				size="small"
				variant="outlined"
				label="Comments"
				required
				value={comment}
				onChange={(e) => setComment(e.target.value)}
			/>
			<Button
				size="small"
				color="error"
				variant="contained"
				onClick={handleApiCalls}
				disabled={!(comment && data[0].id && data[0].usedQuantity)}
			>
				Remove Materials
			</Button>
		</Box>
	);
};

export default UsedQuantity;
