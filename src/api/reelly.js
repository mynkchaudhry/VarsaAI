const BASE = '/api-proxy'

export async function fetchProjects(limit = 100) {
  const res = await fetch(`${BASE}/projects?limit=${limit}`)
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}

export async function fetchProject(id) {
  const res = await fetch(`${BASE}/projects/${id}`)
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}
