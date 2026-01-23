import { apiFetch } from '../util/api';

export async function login(username: string, password: string) {
  const res = apiFetch(`/login`, {
    method: 'POST',
    body: JSON.stringify({
      username,
      password
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Inicio de sesión falló');
      }
      return response.text();
    })
    .then(token => {
      return token;
    })
    .catch(error => {
      console.error('Login error:', error);
      return null;
    });
  return res;
}