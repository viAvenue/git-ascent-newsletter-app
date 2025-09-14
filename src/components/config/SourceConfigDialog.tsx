"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  Rss,
  Bot,
  Trash2,
  Edit,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react"

const initialSources = [
  { id: 1, name: "Harvard Business Review", url: "https://feeds.hbr.org/harvardbusiness", type: "RSS", enabled: true, frequency: "hourly", lastScrape: "2 mins ago", status: "active" },
  { id: 2, name: "McKinsey Insights", url: "https://www.mckinsey.com/featured-insights", type: "Web Scraper", enabled: true, frequency: "daily", lastScrape: "1 hour ago", status: "active" },
  { id: 3, name: "MIT Sloan Management Review", url: "https://sloanreview.mit.edu/feed/", type: "RSS", enabled: true, frequency: "daily", lastScrape: "3 hours ago", status: "active" },
  { id: 4, name: "Strategy+Business", url: "https://www.strategy-business.com", type: "Web Scraper", enabled: true, frequency: "daily", lastScrape: "5 hours ago", status: "active" },
  { id: 5, name: "Deloitte Insights", url: "https://www2.deloitte.com/insights", type: "RSS", enabled: false, frequency: "daily", lastScrape: "1 day ago", status: "disabled" }
]

interface SourceConfigDialogProps {
  children: React.ReactNode
}

export function SourceConfigDialog({ children }: SourceConfigDialogProps) {
  const [sources, setSources] = useState(initialSources)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingSource, setEditingSource] = useState<number | null>(null)
  const [newSource, setNewSource] = useState({
    name: "",
    url: "",
    type: "RSS",
    frequency: "daily",
    enabled: true
  })

  const handleAddSource = () => {
    if (newSource.name && newSource.url) {
      const source = {
        id: sources.length + 1,
        ...newSource,
        lastScrape: "Never",
        status: "pending"
      }
      setSources([...sources, source])
      setNewSource({ name: "", url: "", type: "RSS", frequency: "daily", enabled: true })
      setIsAddingNew(false)
    }
  }

  const toggleSource = (id: number) => {
    setSources(sources.map(source =>
      source.id === id
        ? { ...source, enabled: !source.enabled, status: source.enabled ? "disabled" : "active" }
        : source
    ))
  }

  const deleteSource = (id: number) => {
    setSources(sources.filter(source => source.id !== id))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "disabled":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Content Source Configuration
          </DialogTitle>
          <DialogDescription>
            Manage your content sources, scraping frequencies, and monitoring settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="sources" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Content Sources ({sources.length})</h3>
              <Button onClick={() => setIsAddingNew(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Source
              </Button>
            </div>

            {isAddingNew && (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-sm">Add New Source</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source-name">Source Name</Label>
                      <Input
                        id="source-name"
                        placeholder="e.g., Fortune Magazine"
                        value={newSource.name}
                        onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source-type">Source Type</Label>
                      <Select value={newSource.type} onValueChange={(value) => setNewSource({ ...newSource, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RSS">RSS Feed</SelectItem>
                          <SelectItem value="Web Scraper">Web Scraper</SelectItem>
                          <SelectItem value="API">API Endpoint</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source-url">URL</Label>
                    <Input
                      id="source-url"
                      placeholder="https://example.com/feed or https://example.com/articles"
                      value={newSource.url}
                      onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source-frequency">Scraping Frequency</Label>
                      <Select value={newSource.frequency} onValueChange={(value) => setNewSource({ ...newSource, frequency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Every Hour</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Switch
                        id="source-enabled"
                        checked={newSource.enabled}
                        onCheckedChange={(checked) => setNewSource({ ...newSource, enabled: checked })}
                      />
                      <Label htmlFor="source-enabled">Enable immediately</Label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddSource}>Add Source</Button>
                    <Button variant="outline" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {sources.map((source) => (
                <Card key={source.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {source.type === "RSS" ? <Rss className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          {getStatusIcon(source.status)}
                        </div>
                        <div>
                          <h4 className="font-medium">{source.name}</h4>
                          <p className="text-sm text-slate-500">{source.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge variant={source.type === "RSS" ? "default" : "secondary"} className="text-xs">
                            {source.type}
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">Every {source.frequency}</p>
                          <p className="text-xs text-slate-500">Last: {source.lastScrape}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={source.enabled}
                            onCheckedChange={() => toggleSource(source.id)}
                          />
                          <Button variant="ghost" size="sm" onClick={() => setEditingSource(source.id)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteSource(source.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Global Scheduling Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Default Frequencies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>RSS Feeds</Label>
                      <Select defaultValue="hourly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15min">Every 15 minutes</SelectItem>
                          <SelectItem value="30min">Every 30 minutes</SelectItem>
                          <SelectItem value="hourly">Every Hour</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Web Scrapers</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Every Hour</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Retry Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Max Retries</Label>
                      <Select defaultValue="3">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 retry</SelectItem>
                          <SelectItem value="3">3 retries</SelectItem>
                          <SelectItem value="5">5 retries</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Backoff Strategy</Label>
                      <Select defaultValue="exponential">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linear">Linear</SelectItem>
                          <SelectItem value="exponential">Exponential</SelectItem>
                          <SelectItem value="fixed">Fixed Delay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Monitoring & Alerts</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Alert Conditions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Source failure alerts</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Low content alerts</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Duplicate spike alerts</Label>
                      <Switch />
                    </div>
                    <div className="space-y-2">
                      <Label>Alert threshold (failed sources)</Label>
                      <Select defaultValue="3">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 source</SelectItem>
                          <SelectItem value="3">3 sources</SelectItem>
                          <SelectItem value="5">5 sources</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Notification Channels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Slack notifications</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Email alerts</Label>
                      <Switch />
                    </div>
                    <div className="space-y-2">
                      <Label>Slack Channel</Label>
                      <Input placeholder="#newsletter-automation" defaultValue="#alerts" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Recipients</Label>
                      <Textarea placeholder="admin@company.com" rows={2} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline">Cancel</Button>
          <Button>Save Configuration</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
