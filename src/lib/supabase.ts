import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Server-side client with service role (for Netlify Functions)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types for type safety
export interface Article {
  id: string
  title: string
  content: string
  summary: string
  url: string
  source: string
  source_type: string
  ai_score: number
  ai_relevant: boolean
  ai_topics: string[]
  ai_reason: string
  word_count: number
  reading_time: number
  status: 'processed' | 'filtered' | 'selected' | 'published'
  duplicate_check: boolean
  published_date: string
  scraped_date: string
  processed_date: string
  created_at: string
  updated_at: string
}

export interface Newsletter {
  id: string
  subject: string
  preheader: string
  content: string
  html_content: string
  sections: {}jsonb
  selected_articles: {}jsonb
  word_count: number
  estimated_read_time: number
  status: 'draft' | 'pending_approval' | 'approved' | 'published' | 'rejected'
  workflow_id: string
  opens: number
  clicks: number
  sent_count: number
  created_at: string
  approved_at: string
  published_at: string
  updated_at: string
}

export interface Approval {
  id: string
  approval_type: 'stories' | 'subject-lines' | 'images' | 'final-content'
  item_id: string
  workflow_id: string
  data: {}jsonb
  approved: boolean
  feedback: string
  user_id: string
  user_name: string
  created_at: string
  approved_at: string
  updated_at: string
}

export interface WorkflowLog {
  id: string
  workflow_id: string
  workflow_name: string
  workflow_type: 'data-ingestion' | 'newsletter-generation' | 'approval-processing' | 'publishing'
  status: 'started' | 'running' | 'completed' | 'failed' | 'paused'
  step_name: string
  input_data: {}jsonb
  output_data: {}jsonb
  error_message: string
  execution_time: number
  items_processed: number
  started_at: string
  completed_at: string
  created_at: string
}
