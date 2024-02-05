import AddCircleIcon from "@mui/icons-material/AddCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import PanToolIcon from "@mui/icons-material/PanTool";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import RuleIcon from "@mui/icons-material/Rule";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

function Menuitem({ open, text, link, Icon }) {
	return (
		<Link to={link} style={{ textDecoration: "None", color: "white" }}>
			<ListItem key={text} disablePadding sx={{ display: "block" }}>
				<ListItemButton
					sx={{
						minHeight: 48,
						justifyContent: open ? "initial" : "center",
						px: 2.5,
					}}
				>
					<ListItemIcon
						sx={{
							minWidth: 0,
							mr: open ? 3 : "auto",
							justifyContent: "center",
						}}
					>
						<Icon sx={{ color: "white" }} />
					</ListItemIcon>
					<ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
				</ListItemButton>
			</ListItem>
		</Link>
	);
}
const Sidebar = ({ open, setOpen }) => {
	const theme = useTheme();
	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<Drawer
			variant="permanent"
			open={open}
			PaperProps={{
				sx: { backgroundColor: "#172a3e" },
			}}
		>
			<DrawerHeader>
				<IconButton onClick={handleDrawerClose}>
					{theme.direction === "rtl" ? (
						<ChevronRightIcon sx={{ color: "white" }} />
					) : (
						<ChevronLeftIcon sx={{ color: "white" }} />
					)}
				</IconButton>
			</DrawerHeader>
			<Divider sx={{ backgroundColor: "white" }} />
			{open && (
				<Typography
					sx={{
						fontWeight: "bold",
						color: "white",
						marginTop: "10px",
						marginLeft: "10px",
					}}
				>
					Inventory
				</Typography>
			)}

			<List>
				<Menuitem
					text="View Inventory"
					open={open}
					link="/view-inventory"
					Icon={WarehouseIcon}
				/>
				<Menuitem
					text="Add To Inventory"
					open={open}
					link="/add-inventory"
					Icon={AddCircleIcon}
				/>
				<Menuitem
					text="Use Inventory"
					open={open}
					link="/use-inventory"
					Icon={RemoveShoppingCartIcon}
				/>
			</List>
			<Divider sx={{ backgroundColor: "white" }} />
			{open && (
				<Typography
					sx={{
						fontWeight: "bold",
						color: "white",
						marginTop: "10px",
						marginLeft: "10px",
					}}
				>
					Procurement
				</Typography>
			)}

			<List>
				<Menuitem
					text="MR Dashboard"
					open={open}
					link="/material-request-dashboard"
					Icon={SpaceDashboardIcon}
				/>
				<Menuitem
					text="Request For Material"
					open={open}
					link="/request-material"
					Icon={PanToolIcon}
				/>
				<Menuitem
					text="Reimbursement"
					open={open}
					link="/reimburse-material"
					Icon={CurrencyExchangeIcon}
				/>
				<Menuitem
					text="Pending Approval"
					open={open}
					link="/pending-approval"
					Icon={RuleIcon}
				/>
			</List>
		</Drawer>
	);
};

export default Sidebar;
