import {
	Alert,
	Backdrop,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import toastMessage from "../utils/ToastMessage";
import { useAuth } from "../context/AuthContext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const ProcessOptions = ({ data }) => {
	const { session, user } = useAuth();
	const [openApprove, setOpenApprove] = useState(false);
	const [openReject, setOpenReject] = useState(false);
	const [loading, setLoading] = useState(false);
	const [comments, setComments] = useState("");
	const [error, setError] = useState("");
	const [revertGroup, setRevertGroup] = useState("");
	const [revertGroupList, setRevertGroupList] = useState([]);
	const [isQuotePresent, setIsQuotePresent] = useState(false);
	const groupName = session.accessToken.payload["cognito:groups"][0];

	const fetchQuotations = () => {
		const params = {
			rigId: data.rigId,
			materialRequestId: data.materialRequestId,
		};
		axios
			.get(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/quotation?" +
					new URLSearchParams(params).toString()
			)
			.then((response) => {
				console.log(response.data);
				if (response.data.acceptedQuoteId) {
					setIsQuotePresent(true);
				}
			})
			.catch((error) => {
				toastMessage("error", error.message);
			});
	};

	const approveRequest = () => {
		const params = {
			materialRequestId: data.materialRequestId,
			groupName: session.accessToken.payload["cognito:groups"][0],
			comment: comments,
			user: user.email,
		};
		axios
			.post(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/material-request/approve?" +
					new URLSearchParams(params).toString()
			)
			.then((response) => {
				toastMessage("success", "Request Approved");
				window.location.reload();
			})
			.catch((err) => {
				toastMessage("error", err.message);
			});
	};
	const rejectRequest = () => {
		const params = {
			materialRequestId: data.materialRequestId,
			groupName: groupName,
			targetGroupName: revertGroup,
			comment: comments,
			user: user.email,
		};
		axios
			.post(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/material-request/deny?" +
					new URLSearchParams(params).toString()
			)
			.then(() => {
				toastMessage("success", "Request Approved");
				window.location.reload();
			})
			.catch((err) => {
				toastMessage("error", err.message);
			});
	};
	const getApprovalFlow = () => {
		axios
			.get(
				process.env.REACT_APP_BACKEND_URL +
					"/api/v1/approval-chain?rigId=" +
					data.rigId
			)
			.then((response) => {
				const index = response.data.indexOf(groupName);
				if (index === -1) {
					setRevertGroupList([]);
				} else {
					setRevertGroupList(response.data.slice(0, index));
				}
			})
			.catch((err) => {
				toastMessage("error", err.message);
			});
	};

	useEffect(() => {
		getApprovalFlow();
		fetchQuotations();
	}, []);

	return (
		<div>
			<Stack
				direction="row"
				gap={2}
				alignItems="center"
				justifyContent="center"
				marginTop="4px"
			>
				<Button
					variant="contained"
					size="small"
					onClick={() => setOpenApprove(true)}
					color="success"
				>
					<CheckCircleOutlineIcon />
				</Button>
				<Button
					variant="contained"
					size="small"
					color="error"
					onClick={() => setOpenReject(true)}
				>
					<HighlightOffIcon />
				</Button>
			</Stack>

			<Dialog
				open={openApprove}
				onClose={() => setOpenApprove(!openApprove)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				maxWidth="md"
			>
				{isQuotePresent || groupName !== "Procurement" ? (
					<>
						<Backdrop
							sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
							open={loading}
						>
							<CircularProgress color="inherit" />
						</Backdrop>
						<DialogTitle id="alert-dialog-title">Approve Request</DialogTitle>
						<DialogContent>
							<Stack gap={2}>
								<TextField
									multiline
									disabled={loading}
									sx={{ marginTop: "1rem" }}
									required
									id="Comments"
									label="Approval Comments"
									value={comments}
									onChange={(e) => setComments(e.target.value)}
								/>

								{error && <Alert severity="error"> {error} </Alert>}
							</Stack>
						</DialogContent>
						<DialogActions>
							<Button
								disabled={!comments}
								variant="contained"
								onClick={approveRequest}
							>
								Approve
							</Button>
						</DialogActions>
					</>
				) : (
					<Alert severity="error">
						{" "}
						Please Accept a Quotation from the list of Quotations..{" "}
					</Alert>
				)}
			</Dialog>

			<Dialog
				open={openReject}
				onClose={() => setOpenReject(!openReject)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				maxWidth="md"
			>
				<Backdrop
					sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={loading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
				<DialogTitle id="alert-dialog-title">Reject Request</DialogTitle>
				<DialogContent>
					<Stack gap={2}>
						<TextField
							multiline
							disabled={loading}
							sx={{ marginTop: "1rem" }}
							required
							id="Comments"
							label="Reject Comments"
							value={comments}
							onChange={(e) => setComments(e.target.value)}
						/>
						<FormControl sx={{ minWidth: "20%" }} size="small">
							<InputLabel id="select-rig-input-label">Revert Back</InputLabel>
							<Select
								labelId="revert-label"
								id="revert"
								value={revertGroup}
								label="Revert Back"
								onChange={(e) => setRevertGroup(e.target.value)}
							>
								{revertGroupList.map((group) => (
									<MenuItem value={group} key={group}>
										{group}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{error && <Alert severity="error"> {error} </Alert>}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						disabled={!(comments && revertGroup)}
						variant="contained"
						onClick={rejectRequest}
					>
						Reject
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ProcessOptions;
