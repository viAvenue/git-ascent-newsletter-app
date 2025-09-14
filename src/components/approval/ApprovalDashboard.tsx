"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  FileText,
  Image,
  Mail,
  User,
  Calendar
} from "lucide-react"

interface ApprovalItem {
  id: string
  type: 'stories' | 'subject-lines' | 'images' | 'final-content'
  title: string
  description: string
  data: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  requiredBy?: string
}

const mockApprovals: ApprovalItem[] = [
  {
    id: 'stories-001',
    type: 'stories',
    title: 'Story Selection for Week 32',
    description: '4 stories selected from 73 analyzed articles',
    data: {
      stories: [
        { title: 'The Strategic Advantage of Operational Excellence in SMBs', source: 'McKinsey Insights', score: 92 },
        { title: 'Leadership Transformation in Post-Pandemic Organizations', source: 'Harvard Business Review', score: 89 },
        { title: 'Growth Frameworks for Scaling Service Businesses', source: 'First Round Review', score: 85 },
        { title: 'Cultural Change Management: A Strategic Approach', source: 'Deloitte Insights', score: 88 }
      ]
    },
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    requiredBy: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'subject-002',
    type: 'subject-lines',
    title: 'Subject Line Options',
    description: '3 AI-generated subject lines for approval',
    data: {
      options: [
        { text: 'The Operational Edge: This Week\'s SMB Insights', score: 94, openRate: '24.5%' },
        { text: 'Strategic Moves: Leadership & Growth This Week', score: 88, openRate: '22.1%' },
        { text: 'Owner\'s Brief: Transformation Stories Worth Reading', score: 85, openRate: '21.8%' }
      ],
      preheader: 'McKinsey\'s operational excellence framework, HBR\'s leadership insights, and this week\'s growth strategies for ambitious business owners.'
    },
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    requiredBy: new Date(Date.now() + 1000 * 60 * 60).toISOString()
  },
  {
    id: 'images-003',
    type: 'images',
    title: 'Newsletter Images',
    description: 'AI-generated images for newsletter sections',
    data: {
      images: [
        { type: 'header', url: '/api/placeholder/800/200', alt: 'Strategic Leadership Concept' },
        { type: 'section1', url: '/api/placeholder/400/200', alt: 'Operational Excellence' },
        { type: 'section2', url: '/api/placeholder/400/200', alt: 'Business Growth' }
      ]
    },
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    requiredBy: new Date(Date.now() + 1000 * 60 * 30).toISOString()
  }
]

export function ApprovalDashboard() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(mockApprovals)
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApproval = async (approvalId: string, approved: boolean, feedback?: string) => {
    setIsProcessing(true)

    try {
      // Call Netlify function to process approval
      const response = await fetch('/.netlify/functions/approve-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvalType: selectedApproval?.type,
          itemId: approvalId,
          approved,
          feedback,
          userId: 'current-user' // In real app, get from auth
        })
      })

      if (!response.ok) {
        throw new Error('Failed to process approval')
      }

      const result = await response.json()

      // Update local state
      setApprovals(prev => prev.map(approval =>
        approval.id === approvalId
          ? { ...approval, status: approved ? 'approved' : 'rejected' }
          : approval
      ))

      toast.success(approved ? 'Item approved successfully!' : 'Item rejected', {
        description: `${selectedApproval?.title} has been ${approved ? 'approved' : 'rejected'}`
      })

      setSelectedApproval(null)
      setFeedback("")

    } catch (error) {
      toast.error('Failed to process approval', {
        description: 'Please try again or contact support'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stories':
        return <FileText className="h-4 w-4" />
      case 'subject-lines':
        return <MessageSquare className="h-4 w-4" />
      case 'images':
        return <Image className="h-4 w-4" />
      case 'final-content':
        return <Mail className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stories':
        return 'text-blue-500'
      case 'subject-lines':
        return 'text-green-500'
      case 'images':
        return 'text-purple-500'
      case 'final-content':
        return 'text-red-500'
      default:
        return 'text-slate-500'
    }
  }

  const formatTimeRemaining = (timestamp: string) => {
    const remaining = new Date(timestamp).getTime() - Date.now()
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))

    if (remaining <= 0) return 'Overdue'
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  const pendingApprovals = approvals.filter(a => a.status === 'pending')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Approval Dashboard</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Review and approve newsletter content in real-time
          </p>
        </div>
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          {pendingApprovals.length} Pending
        </Badge>
      </div>

      {/* Pending Approvals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pendingApprovals.map((approval) => (
          <Card key={approval.id} className="border-l-4 border-l-orange-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={getTypeColor(approval.type)}>
                    {getTypeIcon(approval.type)}
                  </div>
                  <CardTitle className="text-lg">{approval.title}</CardTitle>
                </div>
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  {approval.type}
                </Badge>
              </div>
              <CardDescription>{approval.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>AI Generated</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatTimeRemaining(approval.requiredBy || '')}</span>
                </div>
              </div>

              {/* Preview of content */}
              {approval.type === 'stories' && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Selected Stories:</Label>
                  <div className="space-y-1">
                    {approval.data.stories.slice(0, 2).map((story: any, idx: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                      <div key={idx} className="text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded">
                        <div className="font-medium">{story.title}</div>
                        <div className="text-slate-500">{story.source} • Score: {story.score}</div>
                      </div>
                    ))}
                    {approval.data.stories.length > 2 && (
                      <div className="text-xs text-slate-500">+{approval.data.stories.length - 2} more stories</div>
                    )}
                  </div>
                </div>
              )}

              {approval.type === 'subject-lines' && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Top Option:</Label>
                  <div className="text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded">
                    <div className="font-medium">{approval.data.options[0].text}</div>
                    <div className="text-xs text-slate-500">
                      Predicted open rate: {approval.data.options[0].openRate}
                    </div>
                  </div>
                </div>
              )}

              {approval.type === 'images' && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Generated Images:</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {approval.data.images.map((img: any, idx: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                      <div key={idx} className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded text-white text-xs flex items-center justify-center">
                        {img.alt}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => setSelectedApproval(approval)}
                  className="flex-1"
                >
                  Review & Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No pending approvals */}
      {pendingApprovals.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
            <p className="text-slate-600 dark:text-slate-300">
              No pending approvals at the moment. New items will appear here when ready for review.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detailed Review Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className={getTypeColor(selectedApproval.type)}>
                    {getTypeIcon(selectedApproval.type)}
                  </div>
                  {selectedApproval.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedApproval(null)}
                >
                  ✕
                </Button>
              </div>
              <CardDescription>{selectedApproval.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Detailed content preview */}
              {selectedApproval.type === 'stories' && (
                <div className="space-y-4">
                  {selectedApproval.data.stories.map((story: any, idx: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                    <div key={idx} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{story.title}</h4>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>{story.source}</span>
                        <Badge variant="outline">Score: {story.score}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedApproval.type === 'subject-lines' && (
                <div className="space-y-4">
                  {selectedApproval.data.options.map((option: any, idx: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="font-medium mb-2">{option.text}</div>
                      <div className="flex gap-4 text-sm text-slate-500">
                        <span>Score: {option.score}</span>
                        <span>Predicted open rate: {option.openRate}</span>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Label className="text-sm font-medium">Preheader:</Label>
                    <p className="text-sm mt-1">{selectedApproval.data.preheader}</p>
                  </div>
                </div>
              )}

              {/* Feedback section */}
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback (optional)</Label>
                <Textarea
                  id="feedback"
                  placeholder="Add any feedback or comments..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleApproval(selectedApproval.id, true, feedback)}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Approve'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleApproval(selectedApproval.id, false, feedback)}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Reject'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
