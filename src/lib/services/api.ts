import { CapacitorHttp } from "@capacitor/core";
import { token } from "$lib/services/token";

const API_BASE_URL = "https://restapi.ladeklubben.dk";

async function request(method: string, endpoint: string, data?: any, use_auth: boolean = true, checkExpiration: boolean = true) {
	const headers: Record<string, string> = {
		"Content-Type": "application/json;charset=UTF-8",
	};

	// Add auth to headers if use_auth is true
	if (use_auth) {
		// Refresh token if expired
		// checkExpiration is used to prevent infinite recursion
		if (checkExpiration) {
			const expiresAt = await token.getExpiresAt();
			if (expiresAt) {
				if (expiresAt < Math.floor(Date.now() / 1000)) {
					await refreshToken();
				}
			}
		}


		// Add token to headers
		const _token = await token.getToken();
		if (_token) {
			headers["Authorization"] = `Bearer ${_token}`;
		}
	}

	const options = {
		url: `${API_BASE_URL}${endpoint}`,
		headers,
		method,
		data: data ? JSON.stringify(data) : undefined,
	};

	try {
		const response = await CapacitorHttp.request(options);

		// Check if request was successful (status code in 2xx range)
		if (response.status < 200 || response.status >= 300) {
			throw new Error(response.data.detail || `API request failed with status ${response.status}`, { cause: response.status });
		}

		// Only parse JSON if there's a body (check status isn't 204)
		if (response.status === 204) {
			return { success: true }; // Return a simple success object
		}

		// CapacitorHttp already parses JSON responses automatically
		return response.data;
	} catch (error: any) {
		// Refresh token if expired
		if (error.message.includes("expired token")) {
			await refreshToken();
		}

		// Handle network errors or other exceptions
		throw error instanceof Error ? error : new Error("Network error occurred");
	}
}

export async function get(endpoint: string, use_auth: boolean = true, checkExpiration: boolean = true) {
	return request("GET", endpoint, undefined, use_auth, checkExpiration);
}

export async function post(endpoint: string, data: any, use_auth: boolean = true, checkExpiration: boolean = true) {
	return request("POST", endpoint, data, use_auth, checkExpiration);
}

export async function put(endpoint: string, data?: any, use_auth: boolean = true, checkExpiration: boolean = true) {
	return request("PUT", endpoint, data, use_auth, checkExpiration);
}

export async function del(endpoint: string, data: any, use_auth: boolean = true, checkExpiration: boolean = true) {
	return request("DELETE", endpoint, data, use_auth, checkExpiration);
}

export async function patch(endpoint: string, data: any, use_auth: boolean = true, checkExpiration: boolean = true) {
	return request("PATCH", endpoint, data, use_auth, checkExpiration);
}

export async function refreshToken() {
	try {
		const response = await get("/user/tokenrefresh", true, false);
		token.setToken(response.access_token, response.expires);
	} catch (error) {
		console.error("Error refreshing token:", error);
	}
}
