export const PROD_URL = "https://backend.unicauca.edu.co/unid";
export const LOCAL_URL = "http://10.0.2.2:8080/unid"; // 10.0.2.2 = localhost del PC desde emulador Android

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
export class NetworkError extends Error {
  constructor(
    message: string,
    public type: 'TIMEOUT' | 'NETWORK' | 'ABORT' | 'UNKNOWN',
    public url: string,
    public details?: any
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}, timeout = 60000): Promise<Response> {
  // Asegura que el endpoint empiece con / si no lo tiene (opcional, pero buena práctica)
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${path}`;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  // Agregar headers por defecto que algunos servidores requieren
  const defaultHeaders = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'User-Agent': 'UniCaucaID-Mobile-App/1.0',
  };

  // Combinar headers por defecto con los proporcionados
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  try {
    console.log(`[API] Fetching: ${url}`);
    const startTime = Date.now();

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal as AbortSignal,
    });

    const elapsed = Date.now() - startTime;
    console.log(`[API] Response from ${url}: ${response.status} (${elapsed}ms)`);

    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);

    console.error(`[API] Error fetching ${url}:`, error);

    // Clasificar el tipo de error
    if (error.name === 'AbortError') {
      throw new NetworkError(
        `Timeout: La petición a ${url} excedió el tiempo límite de ${timeout}ms`,
        'TIMEOUT',
        url,
        { timeout, originalError: error }
      );
    } else if (error.message === 'Network request failed') {
      throw new NetworkError(
        `Network Error: No se pudo conectar al servidor en ${url}. Verifica tu conexión a internet o que el servidor esté disponible.`,
        'NETWORK',
        url,
        { baseUrl: BASE_URL, endpoint, originalError: error }
      );
    } else {
      throw new NetworkError(
        `Error desconocido: ${error.message}`,
        'UNKNOWN',
        url,
        { originalError: error }
      );
    }
  }
}
