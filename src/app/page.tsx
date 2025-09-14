import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DataIngestionDashboard } from "@/components/DataIngestionDashboard"
import { NewsletterGenerationDashboard } from "@/components/NewsletterGenerationDashboard"
import { WorkflowOverview } from "@/components/WorkflowOverview"
import { ApprovalDashboard } from "@/components/approval/ApprovalDashboard"
import { Toaster } from "@/components/ui/sonner"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            N8N Newsletter Automation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
            Complete serverless automation with in-app approvals, real-time monitoring, and direct n8n integration
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary">Netlify Functions</Badge>
            <Badge variant="secondary">Real-time Approvals</Badge>
            <Badge variant="secondary">N8N Integration</Badge>
            <Badge variant="secondary">Serverless Backend</Badge>
            <Badge variant="secondary">Live Monitoring</Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Workflow Overview</TabsTrigger>
            <TabsTrigger value="ingestion">Part 1: Data Ingestion</TabsTrigger>
            <TabsTrigger value="generation">Part 2: Generation</TabsTrigger>
            <TabsTrigger value="approvals" className="relative">
              Approvals
              <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">3</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <WorkflowOverview />
          </TabsContent>

          <TabsContent value="ingestion" className="space-y-6">
            <DataIngestionDashboard />
          </TabsContent>

          <TabsContent value="generation" className="space-y-6">
            <NewsletterGenerationDashboard />
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <ApprovalDashboard />
          </TabsContent>
        </Tabs>
      </div>

      <Toaster position="top-right" />
    </div>
  )
}
