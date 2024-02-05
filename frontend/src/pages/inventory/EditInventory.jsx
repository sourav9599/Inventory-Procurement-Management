import {
	Box,
	Divider,
	FormControlLabel,
	Radio,
	RadioGroup,
	Typography,
} from "@mui/material";
import { useState } from "react";

const EditInventory = () => {
	const [option, setOption] = useState("");
	return (
		<Box>
			<Typography>EditInventory</Typography>
			<Divider />

			<RadioGroup
				row
				aria-labelledby="demo-controlled-radio-buttons-group"
				name="controlled-radio-buttons-group"
				value={option}
				onChange={(e) => setOption(e.target.value)}
			>
				<FormControlLabel value="Rig" control={<Radio />} label="Rig" />
				<FormControlLabel
					value="Component"
					control={<Radio />}
					label="Component"
				/>
				<FormControlLabel
					value="Equipment"
					control={<Radio />}
					label="Equipment"
				/>
				<FormControlLabel value="Spare" control={<Radio />} label="Spare" />
			</RadioGroup>
		</Box>
	);
};

export default EditInventory;
