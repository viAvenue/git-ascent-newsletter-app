import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  const { httpMethod, queryStringParameters } = event

  if (httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const workflowId = queryStringParameters?.workflowId
    const workflowType = queryStringParameters?.type || 'all'

    const n8nApiUrl = process.env.N8N_API_URL
    const n8nApiKey = process.env.N8N_API_KEY

    let statusData

    if (workflowId) {
      // Get specific workflow execution status
      const response = await fetch(`${n8nApiUrl}/executions/${workflowId}`, {
        headers: {
          'Authorization': `Bearer ${n8nApiKey}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get workflow status: ${response.statusText}`)
      }

      statusData = await response.json()
    } else {
      // Get recent workflow executions
      const response = await fetch(`${n8nApiUrl}/executions?limit=10`, {
        headers: {
          'Authorization': `Bearer ${n8nApiKey}`
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get workflow list: ${response.statusText}`)
      }

      const executions = await response.json()

      // Filter by workflow type if specified
      statusData = {
        recent: executions.data.map((execution: any) => ({
          id: execution.id,
          workflowName: execution.workflowData?.name,
          status: execution.finished ? 'completed' : 'running',
          startTime: execution.startedAt,
          endTime: execution.stoppedAt,
          error: execution.data?.resultData?.error
        }))
      }
    }

    // Add current pending approvals (mock data for demo)
    const pendingApprovals = [
      {
        id: 'stories-001',
        type: 'stories',
        title: 'Story Selection for Week 32',
        description: '4 stories selected from 73 analyzed articles',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 minutes ago
      },
      {
        id: 'subject-002',
        type: 'subject-lines',
        title: 'Subject Line Options',
        description: '3 AI-generated subject lines for approval',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
      }
    ]

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        workflow: statusData,
        pendingApprovals,
        lastUpdated: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('Status fetch error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to get workflow status',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}
