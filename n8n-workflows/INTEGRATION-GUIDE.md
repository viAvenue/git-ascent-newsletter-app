# 🔗 Frontend + N8N Integration Guide

Complete guide for integrating the Netlify frontend with n8n workflows and Supabase database for full newsletter automation with real-time features.

## 🏗️ **Complete Architecture**

```
Netlify Frontend ←→ Supabase Database ←→ N8N Workflows ←→ External APIs
      ↓                    ↓                    ↓             ↓
  User Interface    Real-time Updates    Automation       Content APIs
   - Approvals      - Live Data Sync     - Processing     - OpenAI
   - Config         - Auto REST API      - Scheduling     - Firecrawl
   - Monitoring     - Row Level Security - Error Handling - Email APIs
```

## 🎯 **How It All Works Together**

### **1. Content Ingestion Flow**

**Frontend Action**: User clicks "Start Content Ingestion"
```javascript
// In your Netlify function
const response = await fetch(N8N_WEBHOOK_URL + '/data-ingestion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sources: getConfiguredSources(),
    filters: getFilterConfiguration()
  })
});
```

**N8N Processing**:
1. Webhook triggers data ingestion workflow
2. Scrapes configured RSS feeds and websites
3. AI filters content for business relevance
4. **Stores articles in Supabase** with metadata
5. **Frontend receives real-time updates** via Supabase subscriptions

**Real-time Frontend Update**:
```javascript
// Frontend automatically updates via Supabase real-time
const subscription = supabase
  .channel('articles')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'articles' },
    (payload) => {
      setArticles(prev => [payload.new, ...prev]);
      showNotification(`New article: ${payload.new.title}`);
    }
  )
  .subscribe();
```

### **2. Newsletter Generation Flow**

**Frontend Action**: User clicks "Generate Newsletter"
```javascript
const response = await fetch(N8N_WEBHOOK_URL + '/newsletter-generation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workflowId: generateWorkflowId(),
    preferences: getUserPreferences()
  })
});
```

**N8N Processing**:
1. Retrieves recent articles from Supabase
2. AI analyzes and selects top 3-4 stories
3. **Logs approval request in Supabase**
4. Sends approval notification to frontend

**Frontend Approval Interface**:
```javascript
// Real-time approval updates
const { data: approvals } = useRealTimeSupabase('approvals', {
  filter: { status: 'pending', user_id: currentUser.id }
});

const handleApproval = async (approvalId, approved, feedback) => {
  // Update approval in Supabase
  await supabase
    .from('approvals')
    .update({
      approved,
      feedback,
      approved_at: new Date().toISOString()
    })
    .eq('id', approvalId);

  // Trigger N8N continuation
  await fetch(N8N_WEBHOOK_URL + '/approval-received', {
    method: 'POST',
    body: JSON.stringify({ approvalId, approved, feedback })
  });
};
```

### **3. Publishing Flow**

**Frontend Action**: User approves final newsletter
```javascript
const response = await fetch(N8N_WEBHOOK_URL + '/publish-newsletter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    newsletterId: newsletter.id,
    distribution: getDistributionSettings()
  })
});
```

**N8N Processing**:
1. Converts newsletter to HTML format
2. **Saves complete newsletter to Supabase**
3. **Updates article statuses to "published"**
4. **Logs analytics data**
5. Triggers email distribution (optional)

## 💾 **Supabase Database Integration**

### **Real-time Data Flow**

```javascript
// lib/supabase-hooks.js
import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export function useRealTimeArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('scraped_date', { ascending: false })
        .limit(50);

      if (data) setArticles(data);
      setLoading(false);
    };

    fetchArticles();

    // Real-time subscription
    const subscription = supabase
      .channel('articles_channel')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'articles' },
        (payload) => {
          setArticles(prev => [payload.new, ...prev]);
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'articles' },
        (payload) => {
          setArticles(prev =>
            prev.map(article =>
              article.id === payload.new.id ? payload.new : article
            )
          );
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return { articles, loading };
}

export function useRealTimeWorkflowLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const subscription = supabase
      .channel('workflow_logs_channel')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'workflow_logs' },
        (payload) => {
          setLogs(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return logs;
}
```

### **Database Queries from Frontend**

```javascript
// lib/database-operations.js
export async function getRecentArticles(limit = 20) {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id, title, summary, source, ai_score,
      ai_relevant, status, scraped_date
    `)
    .eq('ai_relevant', true)
    .order('scraped_date', { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function getNewsletterHistory() {
  const { data, error } = await supabase
    .from('newsletters')
    .select(`
      id, subject, status, word_count,
      published_at, opens, clicks
    `)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getPendingApprovals(userId) {
  const { data, error } = await supabase
    .from('approvals')
    .select('*')
    .is('approved', null)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}
```

## 🔄 **N8N Webhook Integration**

### **Netlify Functions for N8N Communication**

```javascript
// netlify/functions/trigger-workflow.js
import { supabase } from '../../lib/supabase';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { workflow, data, userId } = JSON.parse(event.body);

  try {
    // Log workflow start in Supabase
    const { data: logEntry } = await supabase
      .from('workflow_logs')
      .insert({
        workflow_name: workflow,
        status: 'started',
        input_data: data,
        user_id: userId,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    // Trigger N8N workflow
    const response = await fetch(`${process.env.N8N_WEBHOOK_URL}/${workflow}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.N8N_API_KEY}`
      },
      body: JSON.stringify({
        ...data,
        workflowLogId: logEntry.id
      })
    });

    const result = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        workflowLogId: logEntry.id,
        result
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to trigger workflow',
        details: error.message
      })
    };
  }
}
```

### **Status Update Handler**

```javascript
// netlify/functions/workflow-status.js
export async function handler(event, context) {
  const { workflowId, status, data, error } = JSON.parse(event.body);

  try {
    // Update workflow log in Supabase
    await supabase
      .from('workflow_logs')
      .update({
        status,
        output_data: data,
        error_message: error,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('workflow_id', workflowId);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
```

## 🎛️ **Frontend Components**

### **Real-time Article Dashboard**

```jsx
// components/ArticleDashboard.jsx
import { useRealTimeArticles } from '../lib/supabase-hooks';

export function ArticleDashboard() {
  const { articles, loading } = useRealTimeArticles();

  const triggerIngestion = async () => {
    const response = await fetch('/.netlify/functions/trigger-workflow', {
      method: 'POST',
      body: JSON.stringify({
        workflow: 'data-ingestion',
        data: { sources: getConfiguredSources() }
      })
    });
  };

  if (loading) return <div>Loading articles...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Articles ({articles.length})</h2>
        <button
          onClick={triggerIngestion}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Trigger Ingestion
        </button>
      </div>

      <div className="grid gap-4">
        {articles.map(article => (
          <div key={article.id} className="border p-4 rounded">
            <h3 className="font-semibold">{article.title}</h3>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Score: {article.ai_score}</span>
              <span>Status: {article.status}</span>
              <span>Source: {article.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### **Approval Management Interface**

```jsx
// components/ApprovalInterface.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function ApprovalInterface() {
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    // Real-time approvals subscription
    const subscription = supabase
      .channel('approvals')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'approvals' },
        () => fetchApprovals()
      )
      .subscribe();

    fetchApprovals();
    return () => subscription.unsubscribe();
  }, []);

  const fetchApprovals = async () => {
    const { data } = await supabase
      .from('approvals')
      .select('*')
      .is('approved', null)
      .order('created_at', { ascending: false });

    setApprovals(data || []);
  };

  const handleApproval = async (approvalId, approved, feedback) => {
    // Update in Supabase
    await supabase
      .from('approvals')
      .update({ approved, feedback, approved_at: new Date().toISOString() })
      .eq('id', approvalId);

    // Notify N8N
    await fetch('/.netlify/functions/process-approval', {
      method: 'POST',
      body: JSON.stringify({ approvalId, approved, feedback })
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pending Approvals ({approvals.length})</h2>

      {approvals.map(approval => (
        <div key={approval.id} className="border p-4 rounded">
          <h3 className="font-semibold">{approval.approval_type}</h3>
          <div className="mt-2 space-x-2">
            <button
              onClick={() => handleApproval(approval.id, true, '')}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleApproval(approval.id, false, 'Rejected')}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 📊 **Analytics & Monitoring**

### **Real-time Workflow Monitoring**

```jsx
// components/WorkflowMonitor.jsx
import { useRealTimeWorkflowLogs } from '../lib/supabase-hooks';

export function WorkflowMonitor() {
  const logs = useRealTimeWorkflowLogs();

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Live Workflow Activity</h3>

      <div className="max-h-96 overflow-y-auto space-y-2">
        {logs.map(log => (
          <div key={log.id} className="text-sm p-2 border rounded">
            <div className="flex justify-between">
              <span className="font-medium">{log.workflow_name}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                log.status === 'completed' ? 'bg-green-100 text-green-800' :
                log.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {log.status}
              </span>
            </div>
            <div className="text-gray-600">{log.step_name}</div>
            <div className="text-xs text-gray-500">
              {new Date(log.started_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🔐 **Security & Authentication**

### **Environment Variables Setup**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# N8N Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
N8N_API_KEY=your-n8n-api-key
N8N_API_URL=https://your-n8n-instance.com/api/v1

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-netlify-site.netlify.app
```

### **Row Level Security (RLS)**

Supabase policies are automatically configured during setup to ensure:
- Users can only access their own approval records
- Workflow logs are readable by authenticated users
- Articles and newsletters have appropriate access controls

## 🚀 **Deployment Integration**

### **Complete Environment Setup**

1. **Supabase**: Database with real-time subscriptions
2. **Netlify**: Frontend hosting with Functions
3. **N8N**: Workflow automation engine
4. **External APIs**: OpenAI, Firecrawl, email services

### **Verification Checklist**

- ✅ Supabase tables created and indexed
- ✅ Real-time subscriptions working
- ✅ N8N workflows imported and active
- ✅ Netlify Functions deployed
- ✅ Environment variables configured
- ✅ API credentials tested
- ✅ End-to-end workflow tested

## 📚 **Additional Resources**

- **Database Setup**: `../SUPABASE-SETUP.md`
- **Frontend Deployment**: `../NETLIFY-DEPLOYMENT.md`
- **Workflow Configuration**: `README.md`

---

## 🎊 **Integration Complete!**

Your newsletter automation system now features:

✅ **Real-time Updates**: Live data synchronization across all components
✅ **Serverless Architecture**: Scalable and cost-effective deployment
✅ **Modern Database**: Supabase with built-in real-time and security
✅ **Seamless Workflows**: N8N automation with frontend integration
✅ **Production Ready**: Complete monitoring and error handling

**Start automating your newsletter workflow today! 🚀📧**
