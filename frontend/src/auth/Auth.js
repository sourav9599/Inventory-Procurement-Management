import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "./UserPool";

export function signUp(email, password) {
	// Sign up implementation
	return new Promise((resolve, reject) => {
		UserPool.signUp(email, password, [], null, (err, result) => {
			if (err) {
				reject(err);
				console.log(err);
				return;
			}
			console.log(result);
			resolve(result.user);
		});
	});
}

export function confirmSignUp(email, code) {
	// Confirm sign up implementation
	return new Promise((resolve, reject) => {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: UserPool,
		});

		cognitoUser.confirmRegistration(code, true, (err, result) => {
			if (err) {
				reject(err);
				console.log(err);
				return;
			}
			console.log(result);
			resolve(result);
		});
	});
}

export function signIn(email, password) {
	// Sign in implementation
	return new Promise((resolve, reject) => {
		const authenticationDetails = new AuthenticationDetails({
			Username: email,
			Password: password,
		});

		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: UserPool,
		});

		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: (result) => {
				console.log(result);
				resolve(result);
			},
			onFailure: (err) => {
				reject(err);
				console.error(err);
			},
		});
	});
}

export function forgotPassword(email) {
	// Forgot password implementation
	return new Promise((resolve, reject) => {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: UserPool,
		});

		cognitoUser.forgotPassword({
			onSuccess: () => {
				resolve();
			},
			onFailure: (err) => {
				reject(err);
			},
		});
	});
}

export function confirmPassword(email, code, newPassword) {
	// Confirm password implementation
	return new Promise((resolve, reject) => {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: UserPool,
		});

		cognitoUser.confirmPassword(code, newPassword, {
			onSuccess: () => {
				resolve();
			},
			onFailure: (err) => {
				reject(err);
			},
		});
	});
}

export function signOut() {
	// Sign out implementation
	const cognitoUser = UserPool.getCurrentUser();
	if (cognitoUser) {
		cognitoUser.signOut();
	}
}

export function getCurrentUser() {
	// Get current user implementation
	return new Promise((resolve, reject) => {
		const cognitoUser = UserPool.getCurrentUser();

		if (!cognitoUser) {
			reject(new Error("No user found"));
			return;
		}

		cognitoUser.getSession((err, session) => {
			if (err) {
				reject(err);
				return;
			}
			cognitoUser.getUserAttributes((err, attributes) => {
				if (err) {
					reject(err);
					return;
				}
				const userData = attributes.reduce((acc, attribute) => {
					acc[attribute.Name] = attribute.Value;
					return acc;
				}, {});

				resolve({ ...userData, username: cognitoUser.username });
			});
		});
	});
}

export function getSession() {
	// Get session implementation
	const cognitoUser = UserPool.getCurrentUser();
	return new Promise((resolve, reject) => {
		if (!cognitoUser) {
			reject(new Error("No user found"));
			return;
		}
		cognitoUser.getSession((err, session) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(session);
		});
	});
}
