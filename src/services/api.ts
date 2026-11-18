const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiErrorDetails {
  status: number;
  statusText: string;
  data?: any;
  rawText?: string;
}

export class ApiError extends Error {
  status: number;
  statusText: string;
  data?: any;
  rawText?: string;

  constructor(message: string, details: ApiErrorDetails) {
    super(message);
    this.name = 'ApiError';
    this.status = details.status;
    this.statusText = details.statusText;
    this.data = details.data;
    this.rawText = details.rawText;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  let response: Response;

  const token = typeof window !== 'undefined' ? localStorage.getItem('smartdeal_auth_token') : null;
  const mergedHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  try {
    response = await fetch(url, {
      ...options,
      headers: mergedHeaders,
    });
  } catch (networkError: any) {
    throw new Error(
      `Network error connecting to API: ${networkError?.message || 'Server is unreachable'}`
    );
  }

  // 1. Read response as text first (do not blindly call response.json())
  const rawText = await response.text();
  const trimmed = rawText.trim();

  // 2. Safely parse JSON using try/catch
  let parsedData: any = null;
  let isJson = false;

  if (trimmed) {
    try {
      parsedData = JSON.parse(trimmed);
      isJson = true;
    } catch {
      isJson = false;
      parsedData = null;
    }
  }

  // 3. Handle non-2xx HTTP responses
  if (!response.ok) {
    let errorDetail = '';

    if (isJson && parsedData) {
      errorDetail =
        parsedData.error ||
        parsedData.message ||
        (typeof parsedData === 'string' ? parsedData : '');
    }

    if (response.status === 502) {
      errorDetail =
        errorDetail && !errorDetail.toLowerCase().includes('bad gateway')
          ? errorDetail
          : 'Backend server is offline or unreachable on port 3001 (Bad Gateway HTTP 502). Please start the backend with "npm run server" or "npm run dev:all".';
    } else if (response.status === 503) {
      errorDetail = 'Backend service is temporarily unavailable (HTTP 503). Please try again shortly.';
    } else if (response.status === 504) {
      errorDetail = 'Gateway timeout (HTTP 504). The backend server took too long to respond.';
    } else if (!errorDetail) {
      if (trimmed) {
        // Handle HTML or plain text error gracefully (strip HTML tags and normalize whitespace)
        const stripped = trimmed.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
        errorDetail = stripped.length > 200 ? `${stripped.slice(0, 200)}...` : stripped;
      } else {
        errorDetail = response.statusText || 'Request failed';
      }
    }

    const formattedMessage = errorDetail.includes(String(response.status))
      ? errorDetail
      : `${errorDetail} (HTTP ${response.status})`;

    throw new ApiError(formattedMessage, {
      status: response.status,
      statusText: response.statusText,
      data: parsedData,
      rawText
    });
  }

  // 4. Handle 2xx successful responses
  // Handle empty response (e.g. 204 No Content or empty 200) without crashing
  if (!trimmed) {
    return {} as T;
  }

  if (isJson) {
    return parsedData as T;
  }

  // Handle plain text response gracefully
  return { data: rawText, raw: rawText } as unknown as T;
}
