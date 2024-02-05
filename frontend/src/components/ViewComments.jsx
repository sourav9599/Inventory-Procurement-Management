import {
	Box,
	Button,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1),
	},
}));
const ViewComments = ({ comments }) => {
	const [open, setOpen] = useState(false);
	const handleClose = () => {
		setOpen(false);
	};
	const handleOpen = () => {
		setOpen(true);
	};
	return (
		<div>
			<Button size="small" variant="contained" onClick={handleOpen}>
				view
			</Button>
			<BootstrapDialog
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={open}
				fullWidth
			>
				<DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
					{"comments"}
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
					<Stack gap={2}>
						{comments.map((comment, index) => (
							<Box
								key={index}
								display="flex"
								flexDirection="column"
								gap={1}
								borderRadius={1}
								boxShadow={2}
								padding={1}
							>
								<Stack direction="row" gap={2}>
									<Chip label={comment.user} color="secondary" />
									<Chip label={comment.group} color="warning" />
									<Chip
										label={dayjs(comment.timestamp).format(
											"DD-MM-YYYY HH:mm:ss"
										)}
									/>
								</Stack>
								<Box marginLeft={1}>{comment.message}</Box>
							</Box>
						))}
					</Stack>
				</DialogContent>
			</BootstrapDialog>
		</div>
	);
};

export default ViewComments;
