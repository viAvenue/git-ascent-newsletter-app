# 🚀 N8N Newsletter Automation Workflows

Complete n8n workflow templates with **Supabase database integration** for full newsletter automation with real-time features.

## 📁 **Workflow Files**

1. **`01-data-ingestion-workflow.json`** - **Automated daily scraping** (8 AM), AI filtering, and Supabase storage
2. **`02-newsletter-generation-workflow.json`** - Content analysis, story selection, and approval tracking
3. **`03-approval-processing-workflow.json`** - Handles frontend approvals and workflow routing
4. **`04-newsletter-publishing-workflow.json`** - Final formatting, publishing, and analytics
5. **`workflow-config-helper.json`** - Setup validation and configuration assistance

## 🔧 **Quick Setup**

### **1. Prerequisites**

✅ **Supabase Project**: Create and configure database (see `../SUPABASE-SETUP.md`)
✅ **N8N Instance**: Self-hosted or cloud n8n instance
✅ **API Keys**: OpenAI, Firecrawl (optional), email service (optional)

### **2. Import Workflows**

In your n8n instance:
1. Go to **Workflows** → **Import from File**
2. Upload each JSON file in numerical order
3. Save each workflow after import
4. Activate webhooks for each workflow

### **3. Configure Credentials**

Set up these credentials in n8n:

#### **Supabase Database** (Required)
- **Name**: `newsletter_supabase`
- **Host**: `https://your-project-id.supabase.co`
- **Service Role Secret**: Your Supabase service role key
- **Database**: Automatically configured

#### **OpenAI API** (Required)
- **Name**: `openAiApi`
- **API Key**: Your OpenAI API key
- **Organization ID**: (optional)

#### **Firecrawl API** (Optional)
- **Name**: `firecrawlApi`
- **API Key**: Your Firecrawl API key for enhanced web scraping

#### **Email Service** (Optional)
- **Name**: `mailchimpApi` or `sendgridApi`
- **API Key**: Your email service API key for distribution

### **4. Update Configuration**

#### **Replace Placeholder URLs**
Search and replace these in all workflows:

```
https://your-netlify-site.netlify.app → Your actual Netlify URL
https://your-n8n-instance.com → Your n8n instance URL
```

#### **Advanced Automated Scheduling**
The data ingestion workflow includes **comprehensive automatic scheduling**:

**Default Configuration:**
- **Daily Execution**: Every day at 8:00 AM UTC (cron: `0 8 * * *`)
- **18 Pre-configured Sources**: Automatic processing of business content sources
- **Manual Override**: Additional webhook endpoint for on-demand triggering
- **Real-time Status**: Live execution monitoring in frontend dashboard

**6 Scheduling Frequency Options:**
1. **Daily** - `0 8 * * *` - Every day at specified time
2. **Weekdays Only** - `0 8 * * 1-5` - Monday through Friday
3. **Twice Daily** - `0 8,16 * * *` - Morning and afternoon
4. **Every 6 Hours** - `0 */6 * * *` - 4 times per day
5. **Weekly** - `0 8 * * 1` - Once per week (configurable day)
6. **Custom Cron** - Any valid cron expression for advanced users

**Configuration Features:**
- **Timezone Support**: 10+ global timezones (UTC, ET, PT, GMT, CET, JST, etc.)
- **Schedule Preview**: See next 5 execution times before applying
- **Performance Monitoring**: Track success rates and execution duration
- **Easy Management**: Configure via frontend dialog, updates N8N automatically

#### **Webhook Endpoints**
Each workflow provides these endpoints:
- `/webhook/data-ingestion` - Manual content scraping trigger (optional)
- `/webhook/newsletter-generation` - Starts newsletter generation
- `/webhook/approval-received` - Processes approvals
- `/webhook/publish-newsletter` - Publishes newsletter

## 🗄️ **Database Integration**

### **Supabase Tables Used:**
- **`articles`** - Scraped content with AI evaluation
- **`newsletters`** - Generated newsletters with versions
- **`approvals`** - Workflow approval tracking
- **`workflow_logs`** - System activity and performance

### **Key Features:**
✅ **Real-time Updates**: Live data synchronization
✅ **Duplicate Detection**: Automatic content deduplication
✅ **AI Evaluation**: GPT-4 powered content scoring
✅ **Status Tracking**: Complete workflow state management
✅ **Analytics**: Performance metrics and reporting

## 🔄 **Workflow Sequence**

```
1. **AUTOMATED** Data Ingestion (Daily 8 AM) → Scrapes sources → AI filters → Saves to Supabase
                ↓
2. Generation → Retrieves articles → AI selects stories → Requests approval
                ↓
3. Approval → User approves → Generates subject lines → Final approval
                ↓
4. Publishing → Creates HTML → Saves newsletter → Updates analytics
```

## 🧪 **Testing Workflows**

### **Test Data Ingestion:**
```bash
curl -X POST https://your-n8n-instance.com/webhook/data-ingestion \
  -H "Content-Type: application/json" \
  -d '{
    "sources": [
      {
        "name": "Test Source",
        "url": "https://feeds.example.com/rss",
        "type": "RSS",
        "enabled": true
      }
    ]
  }'
```

### **Monitor Execution:**
- Check n8n execution logs
- Monitor Supabase dashboard for data
- Verify webhook responses

## 🚨 **Troubleshooting**

### **Common Issues:**

**Supabase Connection Errors:**
- Verify service role key is correct
- Check Supabase project URL format
- Ensure tables exist with correct schema

**Webhook Timeouts:**
- Increase n8n execution timeout
- Check API rate limits
- Verify network connectivity

**AI Processing Errors:**
- Validate OpenAI API key
- Check API usage limits
- Review content format

## 📊 **Performance Optimization**

### **Database Performance:**
- Indexes are automatically created by setup
- Connection pooling handled by Supabase
- Query optimization built into workflows

### **API Rate Limits:**
- OpenAI: Respect rate limits with delays
- Firecrawl: Configure concurrent requests
- Supabase: Use connection pooling

## 🔐 **Security Best Practices**

✅ **Credentials**: Store API keys securely in n8n
✅ **Webhooks**: Use authentication tokens (recommended)
✅ **Database**: Supabase Row Level Security enabled
✅ **HTTPS**: Always use HTTPS for webhook endpoints

## 📚 **Additional Resources**

- **Complete Setup**: See `../SUPABASE-SETUP.md` for database configuration
- **Deployment**: See `../NETLIFY-DEPLOYMENT.md` for frontend deployment
- **Integration**: See `INTEGRATION-GUIDE.md` for frontend integration

---

## 🎯 **What's Next?**

1. **Set up Supabase** following the database setup guide
2. **Import workflows** and configure credentials
3. **Deploy frontend** using the Netlify deployment guide
4. **Test integration** with sample data
5. **Configure real-time** subscriptions for live updates

**Your automated newsletter system with Supabase is ready! 🚀📧**
