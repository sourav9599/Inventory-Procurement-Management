import { createContext, useState, useEffect, useContext } from "react";
import * as auth from "../auth/Auth";

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}
export function AuthProvider(props) {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [session, setSession] = useState(null);
	const getCurrentUser = async () => {
		try {
			const user = await auth.getCurrentUser();
			console.log(user);
			setUser(user);
		} catch (err) {
			// not logged in
			console.log(err);
			setUser(null);
		}
	};
	const getSession = async () => {
		try {
			const userSession = await auth.getSession();
			setSession(userSession);
			console.log("session : ", userSession);
		} catch (error) {
			setSession(null);
		}
	};

	useEffect(() => {
		getCurrentUser()
			.then(() => {
				setIsLoading(false);
			})
			.catch(() => setIsLoading(false));
		getSession();
	}, []);

	const signIn = async (username, password) => {
		await auth.signIn(username, password);
		await getCurrentUser();
		await getSession();
	};
	const signOut = async () => {
		auth.signOut();
		setUser(null);
	};

	const authValue = {
		user,
		isLoading,
		signIn,
		signOut,
		session,
	};

	return (
		<AuthContext.Provider value={authValue}>
			{props.children}
		</AuthContext.Provider>
	);
}
