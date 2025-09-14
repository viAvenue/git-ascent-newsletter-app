import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  const { httpMethod, body } = event

  if (httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { approvalType, itemId, approved, feedback, userId } = JSON.parse(body || '{}')

    // Store approval in database (could use Fauna, Airtable, or simple KV store)
    const approvalData = {
      id: itemId,
      type: approvalType, // 'stories', 'subject-lines', 'images', 'final-content'
      approved,
      feedback,
      userId,
      timestamp: new Date().toISOString()
    }

    // For demo, we'll use Netlify's KV store or return mock response
    // In production, integrate with your preferred database

    // Trigger next step in N8N workflow based on approval
    if (approved) {
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

      let nextStep
      switch (approvalType) {
        case 'stories':
          nextStep = 'generate-subject-lines'
          break
        case 'subject-lines':
          nextStep = 'generate-content'
          break
        case 'images':
          nextStep = 'finalize-newsletter'
          break
        case 'final-content':
          nextStep = 'publish-newsletter'
          break
      }

      if (nextStep) {
        await fetch(`${n8nWebhookUrl}/${nextStep}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.N8N_API_KEY}`
          },
          body: JSON.stringify({
            approvedItemId: itemId,
            feedback,
            userId
          })
        })
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: true,
        approval: approvalData,
        nextStep: approved ? 'workflow-continued' : 'workflow-paused'
      })
    }

  } catch (error) {
    console.error('Approval error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process approval',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}
