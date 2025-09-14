import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { NewsletterTemplateDialog } from "@/components/config/NewsletterTemplateDialog"
import {
  FileText,
  MessageSquare,
  Image,
  Mail,
  Bot,
  CheckCircle,
  Clock,
  Zap,
  Eye,
  Edit,
  Send,
  Sparkles,
  Settings
} from "lucide-react"

const newsletterSections = [
  { id: 1, title: "Owner's Brief", status: "completed", description: "Top summary and key insights" },
  { id: 2, title: "Weekly Insight", status: "completed", description: "Original article with Ascent Lens" },
  { id: 3, title: "Signals Watch", status: "in-progress", description: "Must-reads from curated sources" },
  { id: 4, title: "Clarity Cue", status: "pending", description: "Weekly reflection or framework prompt" },
  { id: 5, title: "Ascent Activation", status: "pending", description: "Lead magnet or tool CTA" },
  { id: 6, title: "Owner's Edge Insight", status: "pending", description: "Strategic one-liner" },
  { id: 7, title: "Soft CTA Footer", status: "pending", description: "Gentle call-to-action" }
]

const selectedStories = [
  {
    id: 1,
    title: "The Strategic Advantage of Operational Excellence in SMBs",
    source: "McKinsey Insights",
    summary: "How small businesses can leverage operational improvements for competitive advantage",
    theme: "Operations",
    approved: true
  },
  {
    id: 2,
    title: "Leadership Transformation in Post-Pandemic Organizations",
    source: "Harvard Business Review",
    summary: "New leadership paradigms emerging from organizational change",
    theme: "Leadership",
    approved: true
  },
  {
    id: 3,
    title: "Growth Frameworks for Scaling Service Businesses",
    source: "First Round Review",
    summary: "Proven methodologies for sustainable business growth",
    theme: "Growth",
    approved: false
  },
  {
    id: 4,
    title: "Cultural Change Management: A Strategic Approach",
    source: "Deloitte Insights",
    summary: "Framework for managing organizational cultural transformation",
    theme: "Culture",
    approved: true
  }
]

const approvalWorkflow = [
  { stage: "Story Selection", status: "approved", time: "10:30 AM", user: "Sarah M." },
  { stage: "Subject Lines", status: "approved", time: "11:15 AM", user: "Mike T." },
  { stage: "Content Draft", status: "pending", time: "—", user: "—" },
  { stage: "Images", status: "pending", time: "—", user: "—" },
  { stage: "Final Review", status: "pending", time: "—", user: "—" }
]

export function NewsletterGenerationDashboard() {
  return (
    <div className="space-y-6">
      {/* Generation Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Stories Analyzed</p>
                <p className="text-2xl font-bold">73</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Selected</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Approved</p>
                <p className="text-2xl font-bold">2/5</p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Progress</p>
                <p className="text-2xl font-bold">45%</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Analysis & Story Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Story Selection
            </CardTitle>
            <CardDescription>
              LLM analysis of 73 articles from the past 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedStories.map((story) => (
                <div key={story.id} className={`p-3 border rounded-lg ${story.approved ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{story.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{story.source}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{story.theme}</Badge>
                      {story.approved ?
                        <CheckCircle className="h-4 w-4 text-green-500" /> :
                        <Clock className="h-4 w-4 text-orange-500" />
                      }
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{story.summary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              In-App Approval Workflow
            </CardTitle>
            <CardDescription>
              Multi-stage approval process with real-time notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {approvalWorkflow.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      stage.status === 'approved' ? 'bg-green-500' :
                      stage.status === 'pending' ? 'bg-orange-500' : 'bg-slate-300'
                    }`}></div>
                    <span className="text-sm font-medium">{stage.stage}</span>
                  </div>
                  <div className="text-right">
                    <Badge variant={stage.status === 'approved' ? 'default' : 'secondary'} className="text-xs">
                      {stage.status}
                    </Badge>
                    {stage.time !== '—' && (
                      <p className="text-xs text-slate-500 mt-1">{stage.time} by {stage.user}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button className="w-full" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Review in Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Line Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Subject Line Generation
          </CardTitle>
          <CardDescription>
            AI-generated compelling subject lines and preheader text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Generated Options</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">The Operational Edge: This Week's SMB Insights</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Selected - Open rate prediction: 24.5%</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-sm">Strategic Moves: Leadership & Growth This Week</span>
                  <p className="text-xs text-slate-500 mt-1">Open rate prediction: 22.1%</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-sm">Owner's Brief: Transformation Stories Worth Reading</span>
                  <p className="text-xs text-slate-500 mt-1">Open rate prediction: 21.8%</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Preheader Text</h4>
              <div className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-sm">"McKinsey's operational excellence framework, HBR's leadership insights, and this week's growth strategies for ambitious business owners."</p>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Character Count</span>
                    <span>47/50 optimal</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Spam Score</span>
                    <span className="text-green-600">Low (2.1)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Engagement Prediction</span>
                    <span className="text-blue-600">High (8.7/10)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Structure Generation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Newsletter Structure & Content
              </CardTitle>
              <CardDescription>
                AI-powered content generation following the Ascent methodology
              </CardDescription>
            </div>
            <NewsletterTemplateDialog>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure Template
              </Button>
            </NewsletterTemplateDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Section Progress</h4>
              <div className="space-y-2">
                {newsletterSections.map((section) => (
                  <div key={section.id} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        section.status === 'completed' ? 'bg-green-500' :
                        section.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-300'
                      }`}></div>
                      <div>
                        <span className="text-sm font-medium">{section.title}</span>
                        <p className="text-xs text-slate-500">{section.description}</p>
                      </div>
                    </div>
                    <Badge variant={
                      section.status === 'completed' ? 'default' :
                      section.status === 'in-progress' ? 'secondary' : 'outline'
                    } className="text-xs">
                      {section.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Content Guidelines</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">
                  <h5 className="text-sm font-medium mb-1">Tone & Voice</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Professional yet approachable, strategic insights for business owners</p>
                </div>
                <div className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">
                  <h5 className="text-sm font-medium mb-1">Formatting</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Markdown with headers, bold text, contextual links, and clear sections</p>
                </div>
                <div className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">
                  <h5 className="text-sm font-medium mb-1">Length</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300">800-1200 words optimal, scannable format with bullet points</p>
                </div>
              </div>

              <div className="mt-4">
                <Button className="w-full">
                  <Bot className="h-4 w-4 mr-2" />
                  Generate Content
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Generation & Final Formatting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              AI Image Generation
            </CardTitle>
            <CardDescription>
              Contextual images for each newsletter section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Header Image</span>
                  <Badge variant="outline" className="text-xs">Pending Approval</Badge>
                </div>
                <div className="w-full h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs">Strategic Leadership Concept</span>
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Section Dividers</span>
                  <Badge variant="outline" className="text-xs">Generated</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="w-full h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded"></div>
                  <div className="w-full h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded"></div>
                  <div className="w-full h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded"></div>
                </div>
              </div>
            </div>

            <Button className="w-full mt-4" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Images for Approval
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Final Formatting & Distribution
            </CardTitle>
            <CardDescription>
              Newsletter compilation and delivery preparation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Export Options</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-3 w-3 mr-1" />
                    Markdown
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-3 w-3 mr-1" />
                    HTML Email
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Distribution</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Supabase Database</span>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>In-App Notification</span>
                    <Clock className="h-3 w-3 text-orange-500" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Email Platform Ready</span>
                    <Clock className="h-3 w-3 text-orange-500" />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <Progress value={68} className="h-2 mb-2" />
                <p className="text-xs text-slate-500">Overall completion: 68%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Newsletter Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Newsletter Preview
          </CardTitle>
          <CardDescription>
            Live preview of the generated newsletter content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-white dark:bg-slate-900 max-h-96 overflow-y-auto">
            <div className="prose prose-sm dark:prose-invert">
              <h1>The Operational Edge: This Week's SMB Insights</h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                McKinsey's operational excellence framework, HBR's leadership insights, and this week's growth strategies for ambitious business owners.
              </p>

              <h2>📊 Owner's Brief</h2>
              <p>This week's standout insight: <strong>Operational excellence isn't just about efficiency—it's about creating sustainable competitive advantages</strong> that compound over time...</p>

              <h2>🔍 Weekly Insight: The Ascent Lens</h2>
              <p>Our original analysis reveals how small businesses can leverage McKinsey's operational framework...</p>

              <h2>📡 Signals Watch</h2>
              <ul>
                <li><strong>Strategic Advantage of Operational Excellence</strong> - McKinsey Insights</li>
                <li><strong>Leadership Transformation in Post-Pandemic Organizations</strong> - Harvard Business Review</li>
              </ul>

              <p className="text-slate-500 text-xs mt-8">Preview truncated - Full newsletter contains all 7 sections</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Finalize & Send
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
