import { Button } from "@mui/material";
import React from "react";

const CustomButton = ({ children }) => {
	return (
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
			{children}
		</Button>
	);
};

export default CustomButton;
