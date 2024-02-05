import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function RouteGuard({ children }) {
	const { user, session, isLoading } = useAuth();

	if (isLoading) {
		return <></>;
	}

	if (!user || !session) {
		return <Navigate to="/sign-in" />;
	}

	return children;
}

export default RouteGuard;
