import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { SourceConfigDialog } from "@/components/config/SourceConfigDialog"
import { FilterConfigDialog } from "@/components/config/FilterConfigDialog"
import { NewsletterTemplateDialog } from "@/components/config/NewsletterTemplateDialog"
import { ScheduleConfigDialog } from "@/components/config/ScheduleConfigDialog"
import { ArrowRight, Database, FileText, Globe, Rss, Bot, MessageSquare, Image, Mail, Settings, Zap, Clock, CheckCircle2 } from "lucide-react"

export function WorkflowOverview() {
  return (
    <div className="space-y-8">
      {/* Quick Configuration Panel */}
      <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Settings className="h-5 w-5" />
            Quick Configuration
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Customize your newsletter automation workflow with these configuration panels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SourceConfigDialog>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                Configure Sources
                <Badge variant="secondary" className="ml-auto">18 Active</Badge>
              </Button>
            </SourceConfigDialog>

            <FilterConfigDialog>
              <Button variant="outline" className="w-full justify-start">
                <Bot className="h-4 w-4 mr-2" />
                Configure Filters
                <Badge variant="secondary" className="ml-auto">6 Topics</Badge>
              </Button>
            </FilterConfigDialog>

            <NewsletterTemplateDialog>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Configure Template
                <Badge variant="secondary" className="ml-auto">7 Sections</Badge>
              </Button>
            </NewsletterTemplateDialog>
          </div>
        </CardContent>
      </Card>

      {/* Automation Schedule Status */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-500" />
            Automated Schedule Status
          </CardTitle>
          <CardDescription>
            Content ingestion runs automatically with configurable scheduling options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <span className="text-sm font-medium">Daily Schedule</span>
                <p className="text-xs text-green-600 dark:text-green-400">Active - 8:00 AM UTC</p>
                <p className="text-xs text-green-500 mt-1">Next: Tomorrow 8:00 AM</p>
              </div>
              <Badge variant="default" className="bg-green-500 text-white text-xs">Live</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <Rss className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <span className="text-sm font-medium">Manual Trigger</span>
                <p className="text-xs text-blue-600 dark:text-blue-400">Available anytime</p>
                <p className="text-xs text-blue-500 mt-1">18 sources configured</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-6 bg-blue-600 text-white hover:bg-blue-700">Trigger Now</Button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border">
              <Settings className="h-4 w-4 text-slate-500" />
              <div className="flex-1">
                <span className="text-sm font-medium">Schedule Options</span>
                <p className="text-xs text-slate-600 dark:text-slate-400">Daily, weekdays, hourly, custom</p>
                <p className="text-xs text-purple-600 mt-1">6 frequency options available</p>
              </div>
              <ScheduleConfigDialog>
                <Button variant="outline" size="sm" className="text-xs h-6">Configure</Button>
              </ScheduleConfigDialog>
            </div>
          </div>

          {/* Enhanced Execution History */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Recent Executions</h4>
              <Badge variant="outline" className="text-xs">Last 24 hours</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded text-xs">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>Today 8:00 AM - 147 articles processed</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded text-xs">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>Yesterday 8:00 AM - 134 articles processed</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded text-xs">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>Day before 8:00 AM - 156 articles processed</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Flow Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Complete Automation Workflow
          </CardTitle>
          <CardDescription>
            End-to-end newsletter automation from content discovery to publication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Part 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Part 1
                </Badge>
                <h3 className="text-lg font-semibold">AI Data Ingestion</h3>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">18 Content Sources</span>
                  <Badge variant="secondary" className="ml-auto text-xs">Configurable</Badge>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 mx-auto" />

                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Scheduled Scraping</span>
                  <Badge variant="default" className="ml-auto text-xs bg-green-500">Daily 8 AM</Badge>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 mx-auto" />

                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <Bot className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Firecrawl + AI Filtering</span>
                  <Badge variant="secondary" className="ml-auto text-xs">Smart</Badge>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 mx-auto" />

                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <Database className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Supabase Database</span>
                  <Badge variant="secondary" className="ml-auto text-xs">Real-time</Badge>
                </div>
              </div>
            </div>

            {/* Part 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Part 2
                </Badge>
                <h3 className="text-lg font-semibold">Newsletter Generation</h3>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Content Analysis</span>
                  <Badge variant="secondary" className="ml-auto text-xs">AI-Powered</Badge>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 mx-auto" />

                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <MessageSquare className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">In-App Approvals</span>
                  <Badge variant="secondary" className="ml-auto text-xs">Interactive</Badge>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 mx-auto" />

                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <Image className="h-4 w-4 text-pink-500" />
                  <span className="text-sm">AI Content + Images</span>
                  <Badge variant="secondary" className="ml-auto text-xs">Generated</Badge>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 mx-auto" />

                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <Mail className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Newsletter Publication</span>
                  <Badge variant="secondary" className="ml-auto text-xs">Formatted</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Key Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              Intelligent Filtering
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              AI-powered content evaluation focused on strategy, operations, leadership, and business growth topics.
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="secondary" className="text-xs">Strategy</Badge>
              <Badge variant="secondary" className="text-xs">Operations</Badge>
              <Badge variant="secondary" className="text-xs">Leadership</Badge>
              <Badge variant="secondary" className="text-xs">Growth</Badge>
            </div>
            <FilterConfigDialog>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-3 w-3 mr-1" />
                Customize Filters
              </Button>
            </FilterConfigDialog>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-4 w-4 text-green-500" />
              Automated Deduplication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              Checks against existing Supabase content and previous newsletters to prevent duplicate stories.
            </p>
            <Progress value={95} className="h-2 mb-2" />
            <p className="text-xs text-slate-500 mb-3">95% duplicate detection accuracy</p>
            <SourceConfigDialog>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-3 w-3 mr-1" />
                Manage Sources
              </Button>
            </SourceConfigDialog>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              Multi-Stage Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              In-app approval interface for content approval at multiple stages: story selection, subject lines, and images.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-green-500" />
              <span className="text-xs">Real-time notifications</span>
            </div>
            <NewsletterTemplateDialog>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-3 w-3 mr-1" />
                Configure Template
              </Button>
            </NewsletterTemplateDialog>
          </CardContent>
        </Card>
      </div>

      {/* Newsletter Structure */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Newsletter Structure</CardTitle>
              <CardDescription>
                Consistent format following the Ascent methodology
              </CardDescription>
            </div>
            <NewsletterTemplateDialog>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Customize Structure
              </Button>
            </NewsletterTemplateDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Owner's Brief</span>
                <Badge variant="outline" className="text-xs ml-auto">150-200 words</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Weekly Insight</span>
                <Badge variant="outline" className="text-xs ml-auto">300-400 words</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Signals Watch</span>
                <Badge variant="outline" className="text-xs ml-auto">200-300 words</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">Clarity Cue</span>
                <Badge variant="outline" className="text-xs ml-auto">100-150 words</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Ascent Activation</span>
                <Badge variant="outline" className="text-xs ml-auto">50-100 words</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">Owner's Edge Insight</span>
                <Badge variant="outline" className="text-xs ml-auto">20-50 words</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                <span className="text-sm font-medium">Soft CTA Footer</span>
                <Badge variant="outline" className="text-xs ml-auto">30-75 words</Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Total Estimated Length:</span>
              <span className="text-slate-600 dark:text-slate-300">850-1,275 words (~4-6 min read)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
