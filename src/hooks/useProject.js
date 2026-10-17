import { useState, useEffect } from 'react'
import { fetchProject } from '../api/reelly'

export function useProject(id) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetchProject(id)
      .then(setProject)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  return { project, loading, error }
}
