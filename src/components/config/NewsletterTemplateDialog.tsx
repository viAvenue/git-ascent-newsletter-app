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
  FileText,
  Trash2,
  Plus,
  GripVertical,
  Eye,
  Edit,
  Copy,
  Settings,
  Palette,
  Type
} from "lucide-react"

const defaultSections = [
  {
    id: 1,
    name: "Owner's Brief",
    enabled: true,
    description: "Top summary and key insights",
    wordCount: "150-200",
    tone: "Authoritative",
    order: 1
  },
  {
    id: 2,
    name: "Weekly Insight",
    enabled: true,
    description: "Original article with Ascent Lens",
    wordCount: "300-400",
    tone: "Analytical",
    order: 2
  },
  {
    id: 3,
    name: "Signals Watch",
    enabled: true,
    description: "Must-reads from curated sources",
    wordCount: "200-300",
    tone: "Informative",
    order: 3
  },
  {
    id: 4,
    name: "Clarity Cue",
    enabled: true,
    description: "Weekly reflection or framework prompt",
    wordCount: "100-150",
    tone: "Thoughtful",
    order: 4
  },
  {
    id: 5,
    name: "Ascent Activation",
    enabled: true,
    description: "Lead magnet or tool CTA",
    wordCount: "50-100",
    tone: "Persuasive",
    order: 5
  },
  {
    id: 6,
    name: "Owner's Edge Insight",
    enabled: true,
    description: "Strategic one-liner",
    wordCount: "20-50",
    tone: "Memorable",
    order: 6
  },
  {
    id: 7,
    name: "Soft CTA Footer",
    enabled: true,
    description: "Gentle call-to-action",
    wordCount: "30-75",
    tone: "Friendly",
    order: 7
  }
]

const toneOptions = ["Authoritative", "Analytical", "Informative", "Thoughtful", "Persuasive", "Memorable", "Friendly", "Professional", "Conversational", "Expert"]

interface NewsletterTemplateDialogProps {
  children: React.ReactNode
}

export function NewsletterTemplateDialog({ children }: NewsletterTemplateDialogProps) {
  const [sections, setSections] = useState(defaultSections)
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [newSection, setNewSection] = useState({
    name: "",
    description: "",
    wordCount: "100-200",
    tone: "Professional"
  })

  const [templateSettings, setTemplateSettings] = useState({
    name: "Ascent Newsletter",
    totalWordLimit: 1200,
    includeImages: true,
    includeLinks: true,
    formatStyle: "Professional",
    brandVoice: "Strategic and approachable"
  })

  const toggleSection = (id: number) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, enabled: !section.enabled } : section
    ))
  }

  const updateSection = (id: number, field: string, value: string) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    ))
  }

  const addSection = () => {
    if (newSection.name && newSection.description) {
      const section = {
        id: sections.length + 1,
        ...newSection,
        enabled: true,
        order: sections.length + 1
      }
      setSections([...sections, section])
      setNewSection({ name: "", description: "", wordCount: "100-200", tone: "Professional" })
      setIsAddingSection(false)
    }
  }

  const deleteSection = (id: number) => {
    setSections(sections.filter(section => section.id !== id))
  }

  const moveSection = (id: number, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === id)
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < sections.length - 1)) {
      const newSections = [...sections]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      const temp = newSections[index]
      newSections[index] = newSections[targetIndex]
      newSections[targetIndex] = temp

      // Update order numbers
      newSections.forEach((section, idx) => {
        section.order = idx + 1
      })

      setSections(newSections)
    }
  }

  const enabledSections = sections.filter(s => s.enabled)
  const estimatedWordCount = enabledSections.reduce((total, section) => {
    const [min] = section.wordCount.split('-').map(n => parseInt(n))
    return total + min
  }, 0)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Newsletter Template Configuration
          </DialogTitle>
          <DialogDescription>
            Customize your newsletter structure, sections, and formatting preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="structure" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="formatting">Formatting</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Newsletter Sections ({enabledSections.length} active)</h3>
                <p className="text-sm text-slate-500">Estimated word count: {estimatedWordCount} words</p>
              </div>
              <Button onClick={() => setIsAddingSection(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>

            {isAddingSection && (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-sm">Add New Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="section-name">Section Name</Label>
                      <Input
                        id="section-name"
                        placeholder="e.g., Market Trends"
                        value={newSection.name}
                        onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section-tone">Tone</Label>
                      <Select value={newSection.tone} onValueChange={(value) => setNewSection({ ...newSection, tone: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {toneOptions.map(tone => (
                            <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section-description">Description</Label>
                    <Textarea
                      id="section-description"
                      placeholder="Brief description of this section's purpose"
                      value={newSection.description}
                      onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section-word-count">Word Count Range</Label>
                    <Select value={newSection.wordCount} onValueChange={(value) => setNewSection({ ...newSection, wordCount: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50-100">50-100 words</SelectItem>
                        <SelectItem value="100-200">100-200 words</SelectItem>
                        <SelectItem value="200-300">200-300 words</SelectItem>
                        <SelectItem value="300-400">300-400 words</SelectItem>
                        <SelectItem value="400-500">400-500 words</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addSection}>Add Section</Button>
                    <Button variant="outline" onClick={() => setIsAddingSection(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                <Card key={section.id} className={!section.enabled ? "opacity-50" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSection(section.id, 'up')}
                            disabled={section.order === 1}
                            className="h-4 w-4 p-0"
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSection(section.id, 'down')}
                            disabled={section.order === sections.length}
                            className="h-4 w-4 p-0"
                          >
                            ↓
                          </Button>
                        </div>
                        <GripVertical className="h-4 w-4 text-slate-400" />
                        <Switch
                          checked={section.enabled}
                          onCheckedChange={() => toggleSection(section.id)}
                        />
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {section.order}. {section.name}
                            <Badge variant="outline" className="text-xs">{section.wordCount}</Badge>
                          </h4>
                          <p className="text-sm text-slate-500">{section.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="space-y-1">
                            <Label className="text-xs">Tone</Label>
                            <Select
                              value={section.tone}
                              onValueChange={(value) => updateSection(section.id, 'tone', value)}
                            >
                              <SelectTrigger className="w-32 h-6 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {toneOptions.map(tone => (
                                  <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteSection(section.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{enabledSections.length}</div>
                    <div className="text-slate-500">Active Sections</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">~{estimatedWordCount}</div>
                    <div className="text-slate-500">Est. Words</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">~{Math.ceil(estimatedWordCount / 200)}</div>
                    <div className="text-slate-500">Min. Read</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Content Guidelines</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Brand Voice & Tone</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Primary Brand Voice</Label>
                        <Textarea
                          value={templateSettings.brandVoice}
                          onChange={(e) => setTemplateSettings({ ...templateSettings, brandVoice: e.target.value })}
                          rows={3}
                          placeholder="Describe your brand voice and personality..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Writing Style</Label>
                        <Select value={templateSettings.formatStyle} onValueChange={(value) => setTemplateSettings({ ...templateSettings, formatStyle: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Conversational">Conversational</SelectItem>
                            <SelectItem value="Academic">Academic</SelectItem>
                            <SelectItem value="Casual">Casual</SelectItem>
                            <SelectItem value="Authoritative">Authoritative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Content Rules</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Total Word Limit</Label>
                        <Select
                          value={templateSettings.totalWordLimit.toString()}
                          onValueChange={(value) => setTemplateSettings({ ...templateSettings, totalWordLimit: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="800">800 words</SelectItem>
                            <SelectItem value="1000">1000 words</SelectItem>
                            <SelectItem value="1200">1200 words</SelectItem>
                            <SelectItem value="1500">1500 words</SelectItem>
                            <SelectItem value="2000">2000 words</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Include images</Label>
                          <Switch
                            checked={templateSettings.includeImages}
                            onCheckedChange={(checked) => setTemplateSettings({ ...templateSettings, includeImages: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Include contextual links</Label>
                          <Switch
                            checked={templateSettings.includeLinks}
                            onCheckedChange={(checked) => setTemplateSettings({ ...templateSettings, includeLinks: checked })}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Section-Specific Prompts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enabledSections.slice(0, 3).map((section) => (
                    <div key={section.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">{section.name}</h4>
                        <Badge variant="secondary" className="text-xs">{section.tone}</Badge>
                      </div>
                      <Textarea
                        placeholder={`Custom prompt for ${section.name}...`}
                        rows={2}
                        className="text-xs"
                      />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    Configure All Section Prompts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="formatting" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Layout & Formatting</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Typography
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Header Style</Label>
                        <Select defaultValue="h2">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="h1">H1 - Large Headers</SelectItem>
                            <SelectItem value="h2">H2 - Medium Headers</SelectItem>
                            <SelectItem value="h3">H3 - Small Headers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Text Formatting</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Bold key points</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Italic emphasis</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Bullet points</Label>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Visual Elements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Section Dividers</Label>
                        <Select defaultValue="line">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="line">Simple Line</SelectItem>
                            <SelectItem value="emoji">Emoji Dividers</SelectItem>
                            <SelectItem value="stars">Star Pattern</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Link Style</Label>
                        <Select defaultValue="inline">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inline">Inline Links</SelectItem>
                            <SelectItem value="footer">Footer References</SelectItem>
                            <SelectItem value="both">Both Styles</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Image Placement</Label>
                        <Select defaultValue="header">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="header">Header Only</SelectItem>
                            <SelectItem value="sections">Per Section</SelectItem>
                            <SelectItem value="inline">Inline</SelectItem>
                            <SelectItem value="none">No Images</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Export Formats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between">
                      <Label>Markdown</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>HTML Email</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Plain Text</Label>
                      <Switch />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom CSS (for HTML export)</Label>
                    <Textarea
                      placeholder="/* Custom styles for your newsletter */&#10;.newsletter-header { color: #333; }"
                      rows={4}
                      className="font-mono text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Template Preview</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Template
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Full Preview
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Newsletter Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-6 bg-white dark:bg-slate-900 max-h-96 overflow-y-auto">
                    <div className="prose prose-sm dark:prose-invert">
                      <h1>{templateSettings.name}</h1>
                      <p className="text-slate-600 dark:text-slate-300 text-sm italic">
                        {templateSettings.brandVoice}
                      </p>

                      {enabledSections
                        .sort((a, b) => a.order - b.order)
                        .map((section, index) => (
                        <div key={section.id} className="my-4">
                          <h2 className="flex items-center gap-2">
                            {section.order}. {section.name}
                            <Badge variant="outline" className="text-xs">
                              {section.tone}
                            </Badge>
                          </h2>
                          <p className="text-sm text-slate-500 italic">
                            {section.description} ({section.wordCount} words)
                          </p>
                          <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded mt-2 flex items-center justify-center">
                            <span className="text-xs text-slate-500">Content will be generated here</span>
                          </div>
                          {index < enabledSections.length - 1 && (
                            <hr className="my-4 border-slate-200 dark:border-slate-700" />
                          )}
                        </div>
                      ))}

                      <div className="text-center mt-8 pt-4 border-t">
                        <p className="text-xs text-slate-500">
                          Estimated total: ~{estimatedWordCount} words | ~{Math.ceil(estimatedWordCount / 200)} min read
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="font-medium">{enabledSections.length}</div>
                    <div className="text-sm text-slate-500">Sections</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="font-medium">~{estimatedWordCount}</div>
                    <div className="text-sm text-slate-500">Words</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="font-medium">{templateSettings.formatStyle}</div>
                    <div className="text-sm text-slate-500">Style</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline">Load Template</Button>
            <Button variant="outline">Export Template</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Template</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
