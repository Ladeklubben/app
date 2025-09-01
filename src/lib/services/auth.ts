import { writable } from "svelte/store";
import { MD5 } from "crypto-js";
import { goto } from "$app/navigation";
import { post } from "$lib/services/api";
import { fetchUserInformation, clearMemberPricing } from "$lib/services/memberPricing.svelte";
import { token } from "$lib/services/token";

// Create writable stores
export const forgotPasswordEmail = writable<string | null>(null);

// Login and save auth data
export async function login(email: string, password: string, preHashed: boolean): Promise<boolean> {
	try {
		// Normalize email input
		const normalizedEmail = email.trim().toLowerCase();

		// Hash password if not pre-hashed
		let hashedPassword = password;
		if (!preHashed) {
			hashedPassword = MD5(hashedPassword).toString();
		}

		const data = await post("/user/login", { email: normalizedEmail, password: hashedPassword }, false);

		// Save auth data
		token.setToken(data.access_token, data.expires);

		// Fetch user information and member pricing
		await fetchUserInformation();

		return true;
	} catch (error) {
		console.error("Error:", error);
		return false;
	}
}

export async function logout() {
	// Clear auth data from Preferences
	await token.clearLocalStorage();
	clearMemberPricing();
	goto("/login");
}