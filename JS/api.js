// JS/api.js
const API_BASE = 'http://localhost:3000/api';

// Persist just the tenant ID client-side
let tenantId = localStorage.getItem('tenant') || null;
export function setTenant(id) {
  tenantId = id;
  localStorage.setItem('tenant', id);
}

let isRefreshing = false;

/**
 * path: string, e.g. '/cartypes/all'
 * options: {
 *   method?: 'GET'|'POST'|…,
 *   body?: any,
 *   headers?: Record<string,string>
 * }
 */
export async function api(
  path,
  { method = 'GET', body = null, headers: customHeaders = {} } = {}
) {
  const makeRequest = () => {
    const url = `${API_BASE}${path}`;
    console.log('%c[API CALL]', 'color:teal;', url, { method, body, customHeaders });

    // Default headers + any overrides
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    if (tenantId) {
      headers['X-Tenant-ID'] = tenantId;
    }

    return fetch(url, {
      method,
      credentials: 'include',
      headers,
      body: body ? JSON.stringify(body) : null
    });
  };

  // 1) First try
  let res = await makeRequest();

  // 2) Refresh once on 401
  if (res.status === 401 && !isRefreshing) {
    isRefreshing = true;
    console.warn('[API] 401 → refreshing token…');
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });
    if (refreshRes.ok) {
      console.log('[API] refresh OK, retrying original');
      res = await makeRequest();
    } else {
      console.error('[API] refresh failed:', refreshRes.status);
    }
    isRefreshing = false;
  }

  // 3) Still not OK?
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.message || `HTTP ${res.status}`);
  }

  // 4) Parse JSON
  return res.json();
}
