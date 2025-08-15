export const api = (token) => ({
  get: (url) => fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(r=>r.json()),
  post: (url, body, method="POST", t=token) => fetch(url, { method, headers: { "Content-Type":"application/json", ...(t?{Authorization:`Bearer ${t}`}:{}) }, body: JSON.stringify(body) }).then(r=>r.json())
});
