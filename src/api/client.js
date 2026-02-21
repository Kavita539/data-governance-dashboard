import { BASE_URL, getToken, hasToken } from "./config";

export function headers(patch = false) {
  return {
    "Content-Type": patch ? "application/json-patch+json" : "application/json",
    ...(hasToken() && { Authorization: `Bearer ${getToken()}` }),
  };
}

export async function fetchAPI(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: headers(options.patch),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function patchTable(tableId, patchBody) {
  return fetchAPI(`/tables/${tableId}`, {
    method: "PATCH",
    patch: true,
    body: JSON.stringify(patchBody),
  });
}
