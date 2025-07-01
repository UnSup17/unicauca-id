export async function login(username: string, password: string) {
  const url = process.env.EXPO_PUBLIC_API_URL;
  const res = fetch(`${url}/login`, {
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