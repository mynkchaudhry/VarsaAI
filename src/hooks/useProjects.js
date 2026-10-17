import { useState, useEffect } from 'react'
import { fetchProjects } from '../api/reelly'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState(null)

  useEffect(() => {
    fetchProjects(100)
      .then(d => setProjects(d.results.filter(p => p.is_published)))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { projects, loading, error }
}
