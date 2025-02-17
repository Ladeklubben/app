import { writable } from 'svelte/store';
import { fetch } from '@tauri-apps/plugin-http';
import { MD5 } from 'crypto-js';
import { invoke } from '@tauri-apps/api/core';
import { goto } from '$app/navigation';

interface AuthData {
	email: string;
	hashed_password: string;
	token: string;
}

// Create writable stores
export const isLoggedIn = writable(false);
export const currentUser = writable<AuthData | null>(null);

// Check login status and load auth data
export async function checkLoginStatus(): Promise<boolean> {
	try {
		const authData = await getAuth();
		if (authData && authData.token) {
			isLoggedIn.set(true);
			currentUser.set(authData);
			login(authData.email, authData.hashed_password, true);
			return true;
		} else {
			isLoggedIn.set(false);
			currentUser.set(null);
			goto('/login');
			return false;
		}
	} catch (error) {
		isLoggedIn.set(false);
		currentUser.set(null);
		goto('/login');
		return false;
	}
}

// Get auth data from Rust store
export async function getAuth(): Promise<AuthData | null> {
	try {
		return await invoke<AuthData>('get_auth');
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

		const response = await fetch('https://restapi.ladeklubben.dk/user/login', {
			method: 'POST',
			body: JSON.stringify({ email, password: hashedPassword }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Error:', errorData.detail);
			return false;
		}

		const data = await response.json();

		// Create auth data object
		const authData: AuthData = {
			email,
			hashed_password: hashedPassword,
			token: data.access_token
		};

		// Save to Rust store
		await invoke('save_auth', { auth: authData });

		// Update stores
		isLoggedIn.set(true);
		currentUser.set(authData);
		console.log('Logged in:', authData.email);

		return true;
	} catch (error) {
		console.error('Error:', error);
		return false;
	}
}

export async function logout() {
	await invoke('log_out');
	isLoggedIn.set(false);
	currentUser.set(null);
	goto('/login');
}