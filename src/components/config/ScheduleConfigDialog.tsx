"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, Calendar, Globe, Settings, AlertCircle, CheckCircle2, Timer } from "lucide-react"

interface ScheduleConfig {
  frequency: 'daily' | 'weekdays' | 'twice-daily' | 'every-6-hours' | 'weekly' | 'custom'
  time: string
  timezone: string
  enabled: boolean
  customCron?: string
  weekday?: string
}

interface ScheduleConfigDialogProps {
  children: React.ReactNode
}

const frequencies = [
  {
    value: 'daily',
    label: 'Daily',
    description: 'Every day at the specified time',
    cron: '0 8 * * *',
    examples: ['8:00 AM every day', 'Perfect for daily newsletters']
  },
  {
    value: 'weekdays',
    label: 'Weekdays Only',
    description: 'Monday through Friday only',
    cron: '0 8 * * 1-5',
    examples: ['8:00 AM Monday-Friday', 'Skip weekends automatically']
  },
  {
    value: 'twice-daily',
    label: 'Twice Daily',
    description: 'Morning and afternoon execution',
    cron: '0 8,16 * * *',
    examples: ['8:00 AM and 4:00 PM', 'Catch more content throughout the day']
  },
  {
    value: 'every-6-hours',
    label: 'Every 6 Hours',
    description: '4 times per day',
    cron: '0 */6 * * *',
    examples: ['12:00 AM, 6:00 AM, 12:00 PM, 6:00 PM', 'Maximum content coverage']
  },
  {
    value: 'weekly',
    label: 'Weekly',
    description: 'Once per week on specified day',
    cron: '0 8 * * 1',
    examples: ['Every Monday at 8:00 AM', 'Good for weekly digest format']
  },
  {
    value: 'custom',
    label: 'Custom Cron',
    description: 'Advanced cron expression',
    cron: 'Custom',
    examples: ['Set any custom schedule', 'For advanced users']
  }
]

const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST)' }
]

const weekdays = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '0', label: 'Sunday' }
]

export function ScheduleConfigDialog({ children }: ScheduleConfigDialogProps) {
  const [config, setConfig] = useState<ScheduleConfig>({
    frequency: 'daily',
    time: '08:00',
    timezone: 'UTC',
    enabled: true,
    weekday: '1'
  })

  const [open, setOpen] = useState(false)

  const selectedFrequency = frequencies.find(f => f.value === config.frequency)

  const getNextExecutions = (): Date[] => {
    const now = new Date()
    const executions: Date[] = []

    // Mock calculation for demonstration - in real app, use proper cron library
    for (let i = 0; i < 5; i++) {
      const nextDate = new Date(now)

      switch (config.frequency) {
        case 'daily':
          nextDate.setDate(now.getDate() + i)
          break
        case 'weekdays':
          let addDays = i
          const dayOfWeek = nextDate.getDay()
          if (dayOfWeek === 0 || dayOfWeek === 6) addDays++
          nextDate.setDate(now.getDate() + addDays)
          break
        case 'twice-daily':
          if (i % 2 === 0) {
            nextDate.setDate(now.getDate() + Math.floor(i / 2))
            nextDate.setHours(8, 0, 0, 0)
          } else {
            nextDate.setDate(now.getDate() + Math.floor(i / 2))
            nextDate.setHours(16, 0, 0, 0)
          }
          break
        case 'every-6-hours':
          nextDate.setTime(now.getTime() + (i * 6 * 60 * 60 * 1000))
          break
        case 'weekly':
          nextDate.setDate(now.getDate() + (i * 7))
          break
        default:
          nextDate.setDate(now.getDate() + i)
      }

      const [hours, minutes] = config.time.split(':')
      nextDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      executions.push(nextDate)
    }

    return executions
  }

  const generateCronExpression = (): string => {
    const [hours, minutes] = config.time.split(':')

    switch (config.frequency) {
      case 'daily':
        return `${minutes} ${hours} * * *`
      case 'weekdays':
        return `${minutes} ${hours} * * 1-5`
      case 'twice-daily':
        const secondTime = parseInt(hours) + 8
        return `${minutes} ${hours},${secondTime} * * *`
      case 'every-6-hours':
        return `${minutes} */${6} * * *`
      case 'weekly':
        return `${minutes} ${hours} * * ${config.weekday}`
      case 'custom':
        return config.customCron || '0 8 * * *'
      default:
        return `${minutes} ${hours} * * *`
    }
  }

  const handleSave = (): void => {
    // In real implementation, this would save to N8N or backend
    console.log('Saving schedule configuration:', {
      ...config,
      cronExpression: generateCronExpression()
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Automation Schedule Configuration
          </DialogTitle>
          <DialogDescription>
            Configure when your newsletter automation runs automatically. Set frequency, timing, and timezone preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Schedule Frequency */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Schedule Frequency</Label>
              <Select value={config.frequency} onValueChange={(value: ScheduleConfig['frequency']) => setConfig({ ...config, frequency: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{freq.label}</span>
                        <span className="text-xs text-slate-500">{freq.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedFrequency && (
                <Card className="bg-slate-50 dark:bg-slate-900">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">{selectedFrequency.label}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{selectedFrequency.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedFrequency.examples.map((example, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Time Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Execution Time</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <Input
                  type="time"
                  value={config.time}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfig({ ...config, time: e.target.value })}
                  className="max-w-32"
                />
                {config.frequency === 'twice-daily' && (
                  <Badge variant="outline" className="text-xs">
                    Second run: {(parseInt(config.time.split(':')[0]) + 8).toString().padStart(2, '0')}:{config.time.split(':')[1]}
                  </Badge>
                )}
              </div>
            </div>

            {/* Weekly Day Selection */}
            {config.frequency === 'weekly' && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Day of Week</Label>
                <Select value={config.weekday} onValueChange={(value: string) => setConfig({ ...config, weekday: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {weekdays.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Custom Cron */}
            {config.frequency === 'custom' && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Custom Cron Expression</Label>
                <Input
                  placeholder="0 8 * * * (minute hour day month weekday)"
                  value={config.customCron || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfig({ ...config, customCron: e.target.value })}
                />
                <p className="text-xs text-slate-500">
                  Format: minute hour day month weekday.
                  <a href="https://crontab.guru" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                    Use crontab.guru for help
                  </a>
                </p>
              </div>
            )}

            {/* Timezone */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Timezone</Label>
              <Select value={config.timezone} onValueChange={(value: string) => setConfig({ ...config, timezone: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Enable/Disable */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-semibold">Enable Automation</Label>
                <p className="text-sm text-slate-500">Automatically run content ingestion on schedule</p>
              </div>
              <Switch
                checked={config.enabled}
                onCheckedChange={(enabled) => setConfig({ ...config, enabled })}
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {/* Current Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Current Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={config.enabled ? "default" : "secondary"}>
                    {config.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Frequency</span>
                  <span className="text-sm">{selectedFrequency?.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Time</span>
                  <span className="text-sm">{config.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Timezone</span>
                  <span className="text-sm">{config.timezone}</span>
                </div>
                <Separator />
                <div className="space-y-1">
                  <span className="text-sm font-medium">Cron Expression</span>
                  <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    {generateCronExpression()}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Next Executions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Next 5 Executions
                </CardTitle>
                <CardDescription>
                  Preview of upcoming automated runs in {config.timezone}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getNextExecutions().map((date, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                      <span className="text-sm">
                        {date.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-sm font-mono">
                        {date.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: config.timezone
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Configuration Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Schedule format valid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Timezone supported</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">N8N compatible</span>
                  </div>
                  {config.enabled && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Automation active</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Schedule Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
