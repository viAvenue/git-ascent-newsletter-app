import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SourceConfigDialog } from "@/components/config/SourceConfigDialog"
import { FilterConfigDialog } from "@/components/config/FilterConfigDialog"
import { ScheduleConfigDialog } from "@/components/config/ScheduleConfigDialog"
import {
  Globe,
  Calendar,
  Filter,
  Database,
  CheckCircle,
  Clock,
  ExternalLink,
  Bot,
  FileText,
  Search,
  AlertTriangle,
  Settings,
  Plus,
  Timer
} from "lucide-react"

const contentSources = [
  { name: "Harvard Business Review", type: "RSS", status: "active", articles: 12 },
  { name: "McKinsey Insights", type: "Web Scraper", status: "active", articles: 8 },
  { name: "MIT Sloan Management Review", type: "RSS", status: "active", articles: 6 },
  { name: "Strategy+Business", type: "Web Scraper", status: "active", articles: 9 },
  { name: "Deloitte Insights", type: "RSS", status: "active", articles: 7 },
  { name: "BCG Insights", type: "Web Scraper", status: "active", articles: 5 },
  { name: "Bain & Company Insights", type: "Web Scraper", status: "active", articles: 4 },
  { name: "First Round Review", type: "RSS", status: "active", articles: 11 },
  { name: "A16Z Blog", type: "Web Scraper", status: "active", articles: 8 },
  { name: "Y Combinator Blog", type: "RSS", status: "active", articles: 6 },
  { name: "Sequoia Capital Insights", type: "Web Scraper", status: "active", articles: 3 },
  { name: "TechCrunch (Business)", type: "RSS", status: "active", articles: 15 },
  { name: "Fast Company", type: "Web Scraper", status: "active", articles: 10 },
  { name: "Inc.com", type: "RSS", status: "active", articles: 13 },
  { name: "Forbes Leadership", type: "Web Scraper", status: "active", articles: 9 },
  { name: "Knowledge@Wharton", type: "RSS", status: "active", articles: 7 },
  { name: "Stanford Business Insights", type: "Web Scraper", status: "active", articles: 5 },
  { name: "Gallup Business Journal", type: "RSS", status: "active", articles: 4 }
]

const recentActivities = [
  { time: "2 mins ago", action: "Scraped 3 new articles from McKinsey Insights", status: "success" },
  { time: "15 mins ago", action: "Filtered out 2 off-topic articles from TechCrunch", status: "info" },
  { time: "32 mins ago", action: "Detected duplicate: 'Digital Transformation Strategies'", status: "warning" },
  { time: "1 hour ago", action: "Saved 5 articles to Supabase", status: "success" },
  { time: "2 hours ago", action: "Discovered 3 outbound links for additional scraping", status: "info" }
]

export function DataIngestionDashboard() {
  return (
    <div className="space-y-6">
      {/* Pipeline Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Articles Today</p>
                <p className="text-2xl font-bold">147</p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Filtered</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <Filter className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Stored</p>
                <p className="text-2xl font-bold">73</p>
              </div>
              <Database className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Duplicates</p>
                <p className="text-2xl font-bold">16</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Scheduling Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Automated Scheduling & Configuration
              </CardTitle>
              <CardDescription>
                Fully automated content ingestion with configurable frequency options
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <ScheduleConfigDialog>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Schedule
                </Button>
              </ScheduleConfigDialog>
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Trigger Now
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Current Schedule
              </h4>
              <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Daily at 8:00 AM UTC</span>
                  <Badge variant="default" className="bg-green-500 text-white text-xs">Live</Badge>
                </div>
                <p className="text-xs text-green-700 mt-1">18 sources configured</p>
                <p className="text-xs text-green-600 mt-1">Auto-running for 30 days</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Schedule Options</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Daily (current)</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Weekdays only</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Twice daily</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Every 6 hours</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Weekly digest</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Custom cron</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Last Execution</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Time</span>
                  <span className="font-mono">Today 8:00 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration</span>
                  <span className="text-green-600">4m 32s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Articles Found</span>
                  <span className="text-blue-600">147</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>AI Filtered</span>
                  <span className="text-purple-600">73</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Success</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Next Executions</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Tomorrow</span>
                  <span className="font-mono">8:00 AM UTC</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Day after</span>
                  <span className="font-mono">8:00 AM UTC</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Next week</span>
                  <span className="font-mono">8:00 AM UTC</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-xs">
                  <span>Timezone</span>
                  <span className="text-slate-600">UTC</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Automation</span>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Enabled</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">30-Day Performance Metrics</h4>
              <Badge variant="outline" className="text-xs">Automated executions</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <div className="text-lg font-bold text-green-600">98.7%</div>
                <div className="text-xs text-slate-600">Success Rate</div>
              </div>
              <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <div className="text-lg font-bold text-blue-600">4,203</div>
                <div className="text-xs text-slate-600">Articles Processed</div>
              </div>
              <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <div className="text-lg font-bold text-purple-600">5m 12s</div>
                <div className="text-xs text-slate-600">Avg Duration</div>
              </div>
              <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <div className="text-lg font-bold text-orange-600">30/30</div>
                <div className="text-xs text-slate-600">Scheduled Runs</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Sources Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Content Sources (18 Active)
              </CardTitle>
              <CardDescription>
                Automated content collection from diverse business and strategy sources
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <SourceConfigDialog>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Sources
                </Button>
              </SourceConfigDialog>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Source
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentSources.map((source, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{source.name}</h4>
                  <Badge variant={source.type === "RSS" ? "default" : "secondary"} className="text-xs">
                    {source.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{source.articles} articles today</span>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scraping Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Firecrawl Integration
            </CardTitle>
            <CardDescription>
              Clean markdown extraction and content processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm">Content Extraction</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm">Markdown Conversion</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm">Metadata Capture</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
              </div>
            </div>

            <div className="pt-3 border-t">
              <h4 className="font-medium mb-2">Processing Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  AI Content Evaluation
                </CardTitle>
                <CardDescription>
                  Intelligent filtering for relevant business content
                </CardDescription>
              </div>
              <FilterConfigDialog>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Filters
                </Button>
              </FilterConfigDialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Filter Criteria</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">Strategy</Badge>
                <Badge variant="secondary" className="text-xs">Operations</Badge>
                <Badge variant="secondary" className="text-xs">Leadership</Badge>
                <Badge variant="secondary" className="text-xs">Transformation</Badge>
                <Badge variant="secondary" className="text-xs">Growth</Badge>
                <Badge variant="secondary" className="text-xs">SMB Trends</Badge>
              </div>
            </div>

            <div className="pt-3 border-t">
              <h4 className="font-medium mb-2">Today's Results</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Relevant Articles</span>
                  <span className="text-green-600">73/147</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Filtered Out</span>
                  <span className="text-red-600">74/147</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Google Drive Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Supabase Database
            </CardTitle>
            <CardDescription>
              Real-time database storage with structured data and indexing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <span className="text-sm">articles (this week)</span>
                <Badge variant="outline" className="text-xs">73 records</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <span className="text-sm">articles (archived)</span>
                <Badge variant="outline" className="text-xs">1,247 records</Badge>
              </div>
            </div>

            <div className="pt-3 border-t">
              <h4 className="font-medium mb-2">Duplicate Detection</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Checked Against</span>
                  <span>1,320 articles</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duplicates Found</span>
                  <span className="text-orange-600">16 today</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outbound Link Discovery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Outbound Link Discovery
          </CardTitle>
          <CardDescription>
            Automatic detection and scheduling of additional content sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Today's Discoveries</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="h-3 w-3" />
                  <span>Forrester Research (3 links)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="h-3 w-3" />
                  <span>Gartner Insights (2 links)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="h-3 w-3" />
                  <span>PwC Strategy& (1 link)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Scheduled for Scraping</h4>
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs">6 URLs queued</Badge>
                <p className="text-xs text-slate-500">Next run: 2:00 PM</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Success Rate</h4>
              <div className="space-y-1">
                <Progress value={87} className="h-2" />
                <p className="text-xs text-slate-500">87% successful extractions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
