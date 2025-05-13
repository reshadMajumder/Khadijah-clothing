import { API_BASE_URL } from '../data/ApiUrl';

/**
 * Authentication-aware fetch that adds authorization headers when user is logged in
 * @param endpoint - API endpoint to call (without base URL)
 * @param options - Fetch options
 * @returns Promise with fetch response
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get stored tokens
  const tokensString = localStorage.getItem('khadijah-tokens');
  const tokens = tokensString ? JSON.parse(tokensString) : null;

  // Create headers with content type and auth token if available
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add authorization header if access token exists
  if (tokens?.access) {
    headers['Authorization'] = `Bearer ${tokens.access}`;
  }

  // Merge provided options with our headers
  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  // Make the API request
  return fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
}

/**
 * GET request helper
 * @param endpoint - API endpoint
 * @param options - Additional fetch options
 * @returns Promise with JSON response
 */
export async function apiGet<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await apiFetch(endpoint, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/**
 * POST request helper
 * @param endpoint - API endpoint
 * @param data - JSON data to send
 * @param options - Additional fetch options
 * @returns Promise with JSON response
 */
export async function apiPost<T>(
  endpoint: string,
  data: any,
  options: RequestInit = {}
): Promise<T> {
  const response = await apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/**
 * PUT request helper
 * @param endpoint - API endpoint
 * @param data - JSON data to send
 * @param options - Additional fetch options
 * @returns Promise with JSON response
 */
export async function apiPut<T>(
  endpoint: string,
  data: any,
  options: RequestInit = {}
): Promise<T> {
  const response = await apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/**
 * DELETE request helper
 * @param endpoint - API endpoint
 * @param options - Additional fetch options
 * @returns Promise with JSON response
 */
export async function apiDelete<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await apiFetch(endpoint, {
    method: 'DELETE',
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
} 