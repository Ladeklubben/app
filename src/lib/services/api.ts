import { getAuth } from '$lib/services/auth';
import { CapacitorHttp } from '@capacitor/core';

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

    const options = {
        url: `${API_BASE_URL}${endpoint}`,
        headers,
        method,
        data: data ? JSON.stringify(data) : undefined
    };

    try {
        const response = await CapacitorHttp.request(options);

        // Check if request was successful (status code in 2xx range)
        if (response.status < 200 || response.status >= 300) {
            const errorData = response.data || {};
            throw new Error(errorData.detail || `API request failed with status ${response.status}`);
        }

        // Only parse JSON if there's a body (check status isn't 204)
        if (response.status === 204) {
            return { success: true }; // Return a simple success object
        }

        // CapacitorHttp already parses JSON responses automatically
        return response.data;
    } catch (error) {
        // Handle network errors or other exceptions
        throw error instanceof Error ? error : new Error('Network error occurred');
    }
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