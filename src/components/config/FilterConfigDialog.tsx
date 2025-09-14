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
import { Progress } from "@/components/ui/progress"
import {
  Filter,
  Bot,
  Trash2,
  Plus,
  CheckCircle,
  Target,
  Zap,
  Brain,
  TrendingUp
} from "lucide-react"

const initialTopics = [
  { id: 1, name: "Strategy", enabled: true, weight: 10, keywords: ["strategic planning", "competitive advantage", "market positioning"], confidence: 92 },
  { id: 2, name: "Operations", enabled: true, weight: 9, keywords: ["operational excellence", "process improvement", "efficiency"], confidence: 89 },
  { id: 3, name: "Leadership", enabled: true, weight: 8, keywords: ["executive leadership", "team management", "organizational culture"], confidence: 85 },
  { id: 4, name: "Transformation", enabled: true, weight: 8, keywords: ["digital transformation", "organizational change", "innovation"], confidence: 88 },
  { id: 5, name: "Growth", enabled: true, weight: 7, keywords: ["business growth", "scaling", "expansion strategies"], confidence: 91 },
  { id: 6, name: "SMB Trends", enabled: true, weight: 6, keywords: ["small business", "SMB", "entrepreneurship"], confidence: 87 }
]

const excludeKeywords = [
  "celebrity news", "entertainment", "sports", "personal finance", "real estate",
  "travel", "food", "lifestyle", "fashion", "consumer products"
]

interface FilterConfigDialogProps {
  children: React.ReactNode
}

export function FilterConfigDialog({ children }: FilterConfigDialogProps) {
  const [topics, setTopics] = useState(initialTopics)
  const [confidenceThreshold, setConfidenceThreshold] = useState(75)
  const [customPrompt, setCustomPrompt] = useState(
    "Analyze this article for relevance to business strategy, operations, leadership, and growth. Focus on content that would be valuable for business owners and executives making strategic decisions."
  )
  const [isAddingTopic, setIsAddingTopic] = useState(false)
  const [newTopic, setNewTopic] = useState({ name: "", keywords: "", weight: 5 })

  const toggleTopic = (id: number) => {
    setTopics(topics.map(topic =>
      topic.id === id ? { ...topic, enabled: !topic.enabled } : topic
    ))
  }

  const updateWeight = (id: number, weight: number) => {
    setTopics(topics.map(topic =>
      topic.id === id ? { ...topic, weight } : topic
    ))
  }

  const addTopic = () => {
    if (newTopic.name && newTopic.keywords) {
      const topic = {
        id: topics.length + 1,
        name: newTopic.name,
        enabled: true,
        weight: newTopic.weight,
        keywords: newTopic.keywords.split(",").map(k => k.trim()),
        confidence: 0
      }
      setTopics([...topics, topic])
      setNewTopic({ name: "", keywords: "", weight: 5 })
      setIsAddingTopic(false)
    }
  }

  const deleteTopic = (id: number) => {
    setTopics(topics.filter(topic => topic.id !== id))
  }

  const totalWeight = topics.filter(t => t.enabled).reduce((sum, t) => sum + t.weight, 0)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            AI Content Filter Configuration
          </DialogTitle>
          <DialogDescription>
            Customize AI evaluation criteria, topic weights, and filtering thresholds
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
            <TabsTrigger value="prompts">AI Prompts</TabsTrigger>
            <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
          </TabsList>

          <TabsContent value="topics" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Content Topics ({topics.filter(t => t.enabled).length} active)</h3>
                <p className="text-sm text-slate-500">Configure topic priorities and keywords for content evaluation</p>
              </div>
              <Button onClick={() => setIsAddingTopic(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </div>

            {isAddingTopic && (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-sm">Add New Topic</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="topic-name">Topic Name</Label>
                      <Input
                        id="topic-name"
                        placeholder="e.g., Innovation"
                        value={newTopic.name}
                        onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic-weight">Weight (1-10)</Label>
                      <Select value={newTopic.weight.toString()} onValueChange={(value) => setNewTopic({ ...newTopic, weight: parseInt(value) })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9,10].map(w => (
                            <SelectItem key={w} value={w.toString()}>{w}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic-keywords">Keywords (comma-separated)</Label>
                    <Textarea
                      id="topic-keywords"
                      placeholder="innovation, disruptive technology, R&D, creative thinking"
                      value={newTopic.keywords}
                      onChange={(e) => setNewTopic({ ...newTopic, keywords: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addTopic}>Add Topic</Button>
                    <Button variant="outline" onClick={() => setIsAddingTopic(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {topics.map((topic) => (
                <Card key={topic.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={topic.enabled}
                          onCheckedChange={() => toggleTopic(topic.id)}
                        />
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {topic.name}
                            <Badge variant="outline" className="text-xs">Weight: {topic.weight}</Badge>
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {topic.keywords.slice(0, 3).map((keyword, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                            {topic.keywords.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{topic.keywords.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="h-3 w-3 text-green-500" />
                            <span className="text-xs">Confidence: {topic.confidence}%</span>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Weight: {topic.weight}</Label>
                            <Select
                              value={topic.weight.toString()}
                              onValueChange={(value) => updateWeight(topic.id, parseInt(value))}
                            >
                              <SelectTrigger className="w-16 h-6 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1,2,3,4,5,6,7,8,9,10].map(w => (
                                  <SelectItem key={w} value={w.toString()}>{w}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteTopic(topic.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Topic Weight Distribution</span>
                        <span>{((topic.weight / totalWeight) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(topic.weight / totalWeight) * 100} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Topic Weight</span>
                  <Badge variant="outline">{totalWeight}</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="thresholds" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Filtering Thresholds</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        AI Confidence Levels
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Minimum Confidence</Label>
                          <span className="text-sm font-medium">{confidenceThreshold}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="95"
                          value={confidenceThreshold}
                          onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>50% (Permissive)</span>
                          <span>95% (Strict)</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Quality Score Threshold</Label>
                        <Select defaultValue="7">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 - Basic Quality</SelectItem>
                            <SelectItem value="6">6 - Good Quality</SelectItem>
                            <SelectItem value="7">7 - High Quality</SelectItem>
                            <SelectItem value="8">8 - Premium Quality</SelectItem>
                            <SelectItem value="9">9 - Exceptional Quality</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Content Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Minimum Word Count</Label>
                        <Select defaultValue="300">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="150">150 words</SelectItem>
                            <SelectItem value="300">300 words</SelectItem>
                            <SelectItem value="500">500 words</SelectItem>
                            <SelectItem value="1000">1000 words</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Recency Filter</Label>
                        <Select defaultValue="30">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="14">Last 14 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                            <SelectItem value="0">No limit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Advanced Filtering</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label>Duplicate content detection</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Language detection (English only)</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Author credibility check</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Source domain reputation</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prompts" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">AI Evaluation Prompts</h3>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      Primary Evaluation Prompt
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Custom Prompt Instructions</Label>
                      <Textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        rows={6}
                        placeholder="Enter your custom evaluation prompt..."
                      />
                      <p className="text-xs text-slate-500">
                        This prompt will guide the AI in evaluating content relevance and quality.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Temperature</Label>
                        <Select defaultValue="0.3">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.1">0.1 (Very Consistent)</SelectItem>
                            <SelectItem value="0.3">0.3 (Consistent)</SelectItem>
                            <SelectItem value="0.5">0.5 (Balanced)</SelectItem>
                            <SelectItem value="0.7">0.7 (Creative)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Select defaultValue="gpt-4">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                            <SelectItem value="claude-3">Claude 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Prompt Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Business Strategy Focus
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Operational Excellence
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Leadership & Management
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        SMB Growth & Scaling
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="exclusions" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Content Exclusions</h3>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Excluded Keywords</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {excludeKeywords.map((keyword, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {keyword}
                          <Button variant="ghost" size="sm" className="h-3 w-3 p-0 ml-1">
                            <Trash2 className="h-2 w-2" />
                          </Button>
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input placeholder="Add keyword to exclude..." className="flex-1" />
                      <Button size="sm">Add</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Domain Exclusions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Blocked Domains</Label>
                      <Textarea
                        placeholder="example.com&#10;spam-site.net&#10;low-quality-source.org"
                        rows={4}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Auto-block low-reputation domains</Label>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Content Type Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label>Press releases</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Opinion pieces</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Product announcements</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Event announcements</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Job postings</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Sponsored content</Label>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Filter Configuration</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
