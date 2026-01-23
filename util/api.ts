export const PROD_URL = "https://backend.unicauca.edu.co/unid";
export const LOCAL_URL = "http://192.168.101.12:8080/unid"; // Cambia esto por tu IP local si es necesario

// Cambia esta variable para alternar entre local y producción
export const IS_LOCAL = false; 

export const BASE_URL = IS_LOCAL ? LOCAL_URL : PROD_URL;

/**
 * Función centralizada para realizar peticiones a la API.
 * Concatena automáticamente la BASE_URL al endpoint proporcionado.
 * 
 * @param endpoint Ruta del endpoint (ej: "/login", "/app/latest")
 * @param options Opciones de la petición fetch (method, headers, body, etc.)
 * @returns Promesa con la respuesta del fetch
 */
export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  // Asegura que el endpoint empiece con / si no lo tiene (opcional, pero buena práctica)
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${path}`;
  return fetch(url, options);
}
