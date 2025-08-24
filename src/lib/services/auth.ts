import { writable } from "svelte/store";
import { MD5 } from "crypto-js";
import { goto } from "$app/navigation";
import { post } from "$lib/services/api";
import type { AuthData, UserInfo } from "$lib/types/auth.types";
import { Preferences } from "@capacitor/preferences";
import { fetchUserInformation, clearMemberPricing } from "$lib/services/memberPricing.svelte";

// Auth data storage key
const AUTH_DATA_KEY = "auth_data";

// Create writable stores
export const currentUser = writable<AuthData | null>(null);
export const userInfo = writable<UserInfo | null>(null);
export const forgotPasswordEmail = writable<string | null>(null);

// Check login status and load auth data
export async function checkLoginStatus(): Promise<boolean> {
	try {
		const authData = await getAuth();
		if (authData && authData.token) {
			currentUser.set(authData);
			// Fetch user information and member pricing
			await fetchUserInfo();
			return true;
		} else {
			currentUser.set(null);
			goto("/login");
			return false;
		}
	} catch (error) {
		currentUser.set(null);
		goto("/login");
		return false;
	}
}

// Get auth data from Capacitor Preferences
export async function getAuth(): Promise<AuthData | null> {
	try {
		const { value } = await Preferences.get({ key: AUTH_DATA_KEY });
		if (value) {
			return JSON.parse(value) as AuthData;
		}
		return null;
	} catch {
		return null;
	}
}

// Login and save auth data
export async function login(email: string, password: string, preHashed: boolean): Promise<boolean> {
	try {
		// Hash password if not pre-hashed
		let hashedPassword = password;
		if (!preHashed) {
			hashedPassword = MD5(hashedPassword).toString();
		}

		const data = await post("/user/login", { email, password: hashedPassword }, false);

		// Create auth data object
		const authData: AuthData = {
			email,
			hashed_password: hashedPassword,
			token: data.access_token,
		};

		// Save to Capacitor Preferences
		await Preferences.set({
			key: AUTH_DATA_KEY,
			value: JSON.stringify(authData),
		});

		// Update stores
		currentUser.set(authData);
		console.log("Logged in:", authData.email);

		// Fetch user information and member pricing
		await fetchUserInfo();

		return true;
	} catch (error) {
		console.error("Error:", error);
		return false;
	}
}

export async function logout() {
	// Clear auth data from Preferences
	await Preferences.remove({ key: AUTH_DATA_KEY });
	currentUser.set(null);
	userInfo.set(null);
	clearMemberPricing();
	goto("/login");
}

// Fetch user information including member pricing
async function fetchUserInfo() {
	try {
		const info = await fetchUserInformation();
		if (info) {
			userInfo.set(info);
		}
	} catch (error) {
		console.error("Failed to fetch user information:", error);
	}
}
