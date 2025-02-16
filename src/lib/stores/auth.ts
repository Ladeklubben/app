import { writable } from 'svelte/store';
import { fetch } from '@tauri-apps/plugin-http';
import { MD5 } from 'crypto-js';

export const auth = writable({
	token: null,
	user: null,
});

export async function login(email: string, password: string): Promise<boolean> {
	try {
		const hashedPassword = MD5(password).toString();
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
		auth.set({
			token: data.token,
			user: data.user,
		});
		return true;
	} catch (error) {
		console.error('Network error:', error);
		return false;
	}
}