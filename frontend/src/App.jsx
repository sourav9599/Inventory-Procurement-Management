import {
	createRoutesFromElements,
	Route,
	RouterProvider,
	createHashRouter,
} from "react-router-dom";

import SignUp from "./pages/Auth/SignUp";
import ConfirmSignUp from "./pages/Auth/ConfirmSignUp";
import SignIn from "./pages/Auth/SignIn";
import { AuthProvider } from "./context/AuthContext";
import UserProfile from "./pages/Auth/UserProfile";
import RouteGuard from "./context/RouteGuard";
import RootLayout from "./pages/RootLayout";
import ViewInventory from "./pages/inventory/ViewInventory";
import UseInventory from "./pages/inventory/UseInventory";
import AddInventory from "./pages/inventory/AddInventory";
import ResetPassword from "./pages/Auth/ResetPassword";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import CreateMR from "./pages/procurement/CreateMR";
import PendingApproval from "./pages/procurement/PendingApproval";
import MRDashboard from "./pages/procurement/MRDashboard";
import Reimbursement from "./pages/procurement/Reimbursement";
import EditInventory from "./pages/inventory/EditInventory";

const router = createHashRouter(
	createRoutesFromElements(
		<Route>
			<Route path="/sign-up" element={<SignUp />} />
			<Route path="/confirm-sign-up" element={<ConfirmSignUp />} />
			<Route path="/sign-in" element={<SignIn />} />
			<Route path="/reset-password" element={<ResetPassword />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route
				path="/"
				element={
					<RouteGuard>
						<RootLayout />
					</RouteGuard>
				}
			>
				<Route path="user-profile" element={<UserProfile />} />
				<Route path="view-inventory" element={<ViewInventory />} />
				<Route path="use-inventory" element={<UseInventory />} />
				<Route path="add-inventory" element={<AddInventory />} />
				<Route path="update-inventory" element={<EditInventory />} />
				<Route path="request-material" element={<CreateMR />} />
				<Route path="pending-approval" element={<PendingApproval />} />
				<Route path="material-request-dashboard" element={<MRDashboard />} />
				<Route path="reimburse-material" element={<Reimbursement />} />
			</Route>
		</Route>
	)
);
function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	);
}

export default App;
