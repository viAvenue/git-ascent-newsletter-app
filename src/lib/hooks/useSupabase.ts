import { useState, useEffect } from 'react'
import { supabase, Article, Newsletter, Approval, WorkflowLog } from '../supabase'

// Hook for real-time articles
export function useRealTimeArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initial fetch
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('scraped_date', { ascending: false })
          .limit(50)

        if (error) throw error
        setArticles(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()

    // Set up real-time subscription
    const subscription = supabase
      .channel('articles_channel')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'articles' },
        (payload) => {
          setArticles(prev => [payload.new as Article, ...prev])
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'articles' },
        (payload) => {
          setArticles(prev =>
            prev.map(article =>
              article.id === payload.new.id
                ? payload.new as Article
                : article
            )
          )
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { articles, loading, error }
}

// Hook for real-time approvals
export function useRealTimeApprovals() {
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const { data, error } = await supabase
          .from('approvals')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setApprovals(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchApprovals()

    const subscription = supabase
      .channel('approvals_channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'approvals' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setApprovals(prev => [payload.new as Approval, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setApprovals(prev =>
              prev.map(approval =>
                approval.id === payload.new.id
                  ? payload.new as Approval
                  : approval
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setApprovals(prev =>
              prev.filter(approval => approval.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { approvals, loading, error }
}

// Hook for real-time newsletters
export function useRealTimeNewsletters() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const { data, error } = await supabase
          .from('newsletters')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) throw error
        setNewsletters(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchNewsletters()

    const subscription = supabase
      .channel('newsletters_channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'newsletters' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNewsletters(prev => [payload.new as Newsletter, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setNewsletters(prev =>
              prev.map(newsletter =>
                newsletter.id === payload.new.id
                  ? payload.new as Newsletter
                  : newsletter
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { newsletters, loading, error }
}

// Hook for real-time workflow logs
export function useRealTimeWorkflowLogs() {
  const [logs, setLogs] = useState<WorkflowLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('workflow_logs')
          .select('*')
          .order('started_at', { ascending: false })
          .limit(100)

        if (error) throw error
        setLogs(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()

    const subscription = supabase
      .channel('workflow_logs_channel')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'workflow_logs' },
        (payload) => {
          setLogs(prev => [payload.new as WorkflowLog, ...prev])
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'workflow_logs' },
        (payload) => {
          setLogs(prev =>
            prev.map(log =>
              log.id === payload.new.id
                ? payload.new as WorkflowLog
                : log
            )
          )
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { logs, loading, error }
}

// Helper functions for database operations
export const supabaseOperations = {
  // Get pending approvals for a user
  async getPendingApprovals(userId?: string) {
    const query = supabase
      .from('approvals')
      .select('*')
      .is('approved', null)
      .order('created_at', { ascending: false })

    if (userId) {
      query.eq('user_id', userId)
    }

    return await query
  },

  // Get recent articles with filters
  async getRecentArticles(filters?: {
    relevant?: boolean
    status?: string
    limit?: number
  }) {
    let query = supabase
      .from('articles')
      .select('*')
      .order('scraped_date', { ascending: false })

    if (filters?.relevant !== undefined) {
      query = query.eq('ai_relevant', filters.relevant)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    return await query
  },

  // Get newsletter history
  async getNewsletterHistory(limit = 10) {
    return await supabase
      .from('newsletters')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
  },

  // Update approval status
  async updateApproval(id: string, approved: boolean, feedback?: string) {
    return await supabase
      .from('approvals')
      .update({
        approved,
        feedback: feedback || '',
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
  }
}
