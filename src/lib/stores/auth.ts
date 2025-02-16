import { writable } from 'svelte/store';

export const auth = writable({
  token: null,
  user: null,
  error: null,
});

export async function login(email, password) {
  try {
    const response = await post('/user/login', { email, password });
    if (response.status === 200) {
      const data = await response.json();
      if (data.access_token) {
        auth.update(state => ({ ...state, token: data.access_token }));
        const userinfo = await req_userinfo();
        auth.update(state => ({ ...state, user: userinfo }));
      } else {
        auth.update(state => ({ ...state, error: 'Login error' }));
      }
    } else if (response.status === 404) {
      auth.update(state => ({ ...state, error: 'Invalid password' }));
    } else {
      auth.update(state => ({ ...state, error: 'Network error' }));
    }
  } catch (error) {
    auth.update(state => ({ ...state, error: error.message }));
  }
}

async function req_userinfo() {
  // Implement the function to fetch user info
}