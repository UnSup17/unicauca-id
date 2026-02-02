import AsyncStorage from '@react-native-async-storage/async-storage';

export type Environment = 'PROD' | 'TEST' | 'DEV';

export const ENVIRONMENTS: Record<Environment, string> = {
  PROD: "https://backend.unicauca.edu.co/unid",
  TEST: "https://kubetest.unicauca.edu.co/unid",
  DEV: "http://192.168.101.16:8080/unid",
};

const ENV_STORAGE_KEY = '@app_environment';

let currentEnv: Environment = 'PROD';
let currentBaseUrl = ENVIRONMENTS.PROD;

// Global debug state for the overlay
export interface ApiDebugInfo {
  endpoint: string;
  response: string;
  status: number;
  timestamp: number;
}

let lastDebugInfo: ApiDebugInfo | null = null;
let onDebugUpdate: ((info: ApiDebugInfo) => void) | null = null;

export const setDebugListener = (listener: (info: ApiDebugInfo) => void) => {
  onDebugUpdate = listener;
};

const updateDebugInfo = (path: string, status: number, response: string) => {
  if (currentEnv === 'PROD') return;

  const info: ApiDebugInfo = {
    endpoint: path,
    response: response,
    status: status,
    timestamp: Date.now()
  };
  lastDebugInfo = info;
  if (onDebugUpdate) onDebugUpdate(info);
};

export const getApiDebugInfo = () => lastDebugInfo;

export const getCurrentEnv = () => currentEnv;

export const setEnvironment = async (env: Environment) => {
  currentEnv = env;
  currentBaseUrl = ENVIRONMENTS[env];
  console.log(`[API] Environment changed to: ${env} (${currentBaseUrl})`);
  await AsyncStorage.setItem(ENV_STORAGE_KEY, env);
};

export const initEnvironment = async () => {
  const savedEnv = await AsyncStorage.getItem(ENV_STORAGE_KEY) as Environment;
  if (savedEnv && ENVIRONMENTS[savedEnv]) {
    currentEnv = savedEnv;
    currentBaseUrl = ENVIRONMENTS[savedEnv];
  }
  console.log(`[API] Initialized environment: ${currentEnv} (${currentBaseUrl})`);
  return currentEnv;
};

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
  const url = `${currentBaseUrl}${path}`;

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

    // Capture debug info if not in production
    // if (currentEnv !== 'PROD') {
    const responseClone = response.clone();
    responseClone.text().then(text => {
      updateDebugInfo(path, response.status, text);
    }).catch(e => console.warn("[API] Could not clone response for debug", e));
    // }

    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);

    console.error(`[API] Error fetching ${url}:`, error);

    // Update debug info with error
    updateDebugInfo(path, 0, `ERROR: ${error.message || 'Unknown'}`);

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
        { baseUrl: currentBaseUrl, endpoint, originalError: error }
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
