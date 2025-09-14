import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  const { httpMethod, body, queryStringParameters } = event

  if (httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { workflowType, config } = JSON.parse(body || '{}')

    // N8N API integration
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    const n8nApiKey = process.env.N8N_API_KEY

    let webhookEndpoint
    switch (workflowType) {
      case 'data-ingestion':
        webhookEndpoint = `${n8nWebhookUrl}/data-ingestion`
        break
      case 'newsletter-generation':
        webhookEndpoint = `${n8nWebhookUrl}/newsletter-generation`
        break
      case 'content-approval':
        webhookEndpoint = `${n8nWebhookUrl}/content-approval`
        break
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid workflow type' })
        }
    }

    // Trigger N8N workflow
    const response = await fetch(webhookEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${n8nApiKey}`
      },
      body: JSON.stringify(config)
    })

    if (!response.ok) {
      throw new Error(`N8N workflow failed: ${response.statusText}`)
    }

    const result = await response.json()

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: true,
        workflowId: result.workflowId,
        status: 'triggered'
      })
    }

  } catch (error) {
    console.error('Workflow trigger error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to trigger workflow',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}
