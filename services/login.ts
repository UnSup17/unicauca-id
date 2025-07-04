import Constants from 'expo-constants';

export async function login(username: string, password: string) {
  const res = fetch(`${Constants.expoConfig?.extra?.apiUrl || "https://backend.unicauca.edu.co/unid"}/login`, {
    method: 'POST',
    body: JSON.stringify({
      username,
      password
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
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