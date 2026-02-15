import { apiFetch } from '../util/api';

export async function login(username: string, password: string) {
  const res = apiFetch(`/login`, {
    method: 'POST',
    body: JSON.stringify({
      username,
      password
    })
  })
    .then(async response => {
      if (!response.ok) {
        let errorMessage = 'Inicio de sesión falló';
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
            if (errorData.detail) {
              errorMessage += `\n\n${errorData.detail}`;
            }
          }
        } catch (e) {
          // If not JSON, use default or status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      return response.text();
    })
    .then(token => {
      return token;
    });
  return res;
}