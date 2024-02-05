import { useAuth } from "../../context/AuthContext";

export default function UserProfile() {
	const { user, signOut } = useAuth();

	return (
		<div>
			{user && (
				<div>
					<h2>User Profile</h2>
					<p>Username: {user.username}</p>
					<p>Email: {user.email}</p>
					{/* Display any other user data here */}
				</div>
			)}
			<button onClick={signOut}>Sign Out</button>
		</div>
	);
}
