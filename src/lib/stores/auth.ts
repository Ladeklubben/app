import { writable } from 'svelte/store';
import { fetch } from '@tauri-apps/plugin-http';
import { MD5 } from 'crypto-js';
import { invoke } from '@tauri-apps/api/core';
import { goto } from '$app/navigation';

// Create a writable store to keep track of the login status
export const isLoggedIn = writable(false);

// Checks if the user is logged in by checking if the token is present and valid
export async function checkLoginStatus(): Promise<boolean> {
    try {
        const token = await getToken();
        if (token) {
            isLoggedIn.set(true);
            return true;
        } else {
            isLoggedIn.set(false);
            return false;
        }
    } catch (error) {
        isLoggedIn.set(false);
        return false;
    }
}

// Gets the auth token from the Tauri Rust store 
export function getToken() {
    return invoke('get_auth_token').catch(() => {
        return false;
    });
}

// Saves the auth token to the Tauri Rust store
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
		invoke('save_auth_token', { token: data.access_token });
		return true;
	} catch (error) {
		console.error('Error:', error);
		return false;
	}
}

export function logout() {
	invoke('log_out');
	goto('/login');
}