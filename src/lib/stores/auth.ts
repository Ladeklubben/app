import { writable } from 'svelte/store';
import { fetch } from '@tauri-apps/plugin-http';

export const auth = writable({
  token: null,
  user: null,
  error: null,
});

export async function login(email: string, password: string) {
  try {
    const response = await fetch('https://restapi.ladeklubben.dk/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.detail);
      return;
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Network error:', error);
  }
}