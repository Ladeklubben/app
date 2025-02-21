import { fetch } from '@tauri-apps/plugin-http';
import { getAuth } from '$lib/services/auth';

const API_BASE_URL = 'https://restapi.ladeklubben.dk';

async function request(method: string, endpoint: string, data?: any, auth: boolean = true) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json;charset=UTF-8',
    };

    if (auth) {
        const authData = await getAuth();
        const token = authData?.token || null;
		// TODO: Handle if the token is expired
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'API request failed');
    }

    return response.json();
}

export async function get(endpoint: string, auth: boolean = true) {
	return request('GET', endpoint, undefined, auth);
}

export async function post(endpoint: string, data: any, auth: boolean = true) {
	return request('POST', endpoint, data, auth);
}

export async function put(endpoint: string, data: any, auth: boolean = true) {
	return request('PUT', endpoint, data, auth);
}

export async function del(endpoint: string, auth: boolean = true) {
	return request('DELETE', endpoint, undefined, auth);
}