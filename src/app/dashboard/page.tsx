'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles,
  Plus,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Settings,
  BarChart3,
} from 'lucide-react';
import {
  mockStatusPage,
  getActiveIncidents,
  addIncident,
  addIncidentUpdate,
} from '@/lib/mock-data';
import {
  Incident,
  IncidentStatus,
  IncidentSeverity,
  statusColors,
  statusLabels,
  incidentStatusLabels,
  incidentStatusColors,
} from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const [statusPage, setStatusPage] = useState(mockStatusPage);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Form states
  const [newIncidentTitle, setNewIncidentTitle] = useState('');
  const [newIncidentSeverity, setNewIncidentSeverity] = useState<IncidentSeverity>('minor');
  const [newIncidentComponents, setNewIncidentComponents] = useState<string[]>([]);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateStatus, setUpdateStatus] = useState<IncidentStatus>('investigating');

  const activeIncidents = statusPage.incidents.filter(i => i.status !== 'resolved');
  const resolvedIncidents = statusPage.incidents.filter(i => i.status === 'resolved');

  const handleCreateIncident = () => {
    if (!newIncidentTitle.trim()) return;

    const incident = addIncident({
      title: newIncidentTitle,
      severity: newIncidentSeverity,
      status: 'investigating',
      affectedComponents: newIncidentComponents,
    });

    setStatusPage({ ...mockStatusPage });
    setNewIncidentTitle('');
    setNewIncidentSeverity('minor');
    setNewIncidentComponents([]);
    setIsCreateDialogOpen(false);
  };

  const handleAddUpdate = () => {
    if (!selectedIncident || !updateMessage.trim()) return;

    addIncidentUpdate(selectedIncident.id, {
      status: updateStatus,
      message: updateMessage,
      isAIGenerated: false,
    });

    setStatusPage({ ...mockStatusPage });
    setUpdateMessage('');
    setIsUpdateDialogOpen(false);
    setSelectedIncident(null);
  };

  const generateAIUpdate = async () => {
    if (!selectedIncident) return;

    setIsGeneratingAI(true);

    try {
      const componentNames = selectedIncident.affectedComponents.map(
        compId => statusPage.components.find(c => c.id === compId)?.name || compId
      );

      const response = await fetch('/api/ai/generate-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentTitle: selectedIncident.title,
          status: updateStatus,
          severity: selectedIncident.severity,
          componentNames,
          previousUpdates: selectedIncident.updates.slice(0, 3).map(u => ({
            status: u.status,
            message: u.message,
          })),
        }),
      });

      const data = await response.json();

      if (data.message) {
        setUpdateMessage(data.message);
      }
    } catch (error) {
      console.error('Failed to generate AI update:', error);
      // Fallback to simple message
      setUpdateMessage(`We are currently ${updateStatus} the issue: ${selectedIncident.title}. Updates will follow.`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">StatusAI</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <span className="text-muted-foreground">Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/status" target="_blank">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Status Page
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {statusPage.components.filter(c => c.status === 'operational').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Operational</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeIncidents.length}</p>
                  <p className="text-sm text-muted-foreground">Active Incidents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{statusPage.components.length}</p>
                  <p className="text-sm text-muted-foreground">Components</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">99.9%</p>
                  <p className="text-sm text-muted-foreground">Uptime (30d)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Incidents */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Incidents */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Incidents</CardTitle>
                  <CardDescription>Ongoing issues requiring attention</CardDescription>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Incident
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Incident</DialogTitle>
                      <DialogDescription>
                        Report a new incident that affects your services
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Title</label>
                        <Input
                          placeholder="Brief description of the issue"
                          value={newIncidentTitle}
                          onChange={(e) => setNewIncidentTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Severity</label>
                        <Select
                          value={newIncidentSeverity}
                          onValueChange={(v) => setNewIncidentSeverity(v as IncidentSeverity)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minor">Minor</SelectItem>
                            <SelectItem value="major">Major</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Affected Components
                        </label>
                        <Select
                          value={newIncidentComponents[0] || ''}
                          onValueChange={(v) => setNewIncidentComponents([v])}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select component" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusPage.components.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateIncident}>Create Incident</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {activeIncidents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No active incidents. All systems operational!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeIncidents.map((incident) => (
                      <div
                        key={incident.id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-medium">{incident.title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {incident.severity}
                              </Badge>
                              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                <div className={`h-2 w-2 rounded-full ${incidentStatusColors[incident.status]}`} />
                                {incidentStatusLabels[incident.status]}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedIncident(incident);
                              setUpdateStatus(incident.status);
                              setIsUpdateDialogOpen(true);
                            }}
                          >
                            Post Update
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Resolved */}
            <Card>
              <CardHeader>
                <CardTitle>Recently Resolved</CardTitle>
                <CardDescription>Incidents resolved in the past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {resolvedIncidents.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No recent incidents</p>
                ) : (
                  <div className="space-y-3">
                    {resolvedIncidents.slice(0, 5).map((incident) => (
                      <div
                        key={incident.id}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium text-sm">{incident.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Resolved {formatDistanceToNow(new Date(incident.resolvedAt!), { addSuffix: true })}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-green-600 bg-green-100">
                          Resolved
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Components */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Components</CardTitle>
                <CardDescription>Current status of your services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statusPage.components.map((component) => (
                    <div
                      key={component.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <span className="text-sm font-medium">{component.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {statusLabels[component.status]}
                        </span>
                        <div className={`h-3 w-3 rounded-full ${statusColors[component.status]}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  AI Assistant
                </CardTitle>
                <CardDescription>Let AI help you communicate</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Click &quot;Generate with AI&quot; when posting incident updates to get
                  professionally written communications in seconds.
                </p>
                <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    Pro tip: AI-generated updates are marked with a sparkle icon on your
                    public status page, building trust with transparency.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Post Incident Update</DialogTitle>
            <DialogDescription>
              {selectedIncident?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={updateStatus}
                onValueChange={(v) => setUpdateStatus(v as IncidentStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="identified">Identified</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Message</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAIUpdate}
                  disabled={isGeneratingAI}
                  className="text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
                </Button>
              </div>
              <Textarea
                placeholder="Describe the current status and any actions taken..."
                value={updateMessage}
                onChange={(e) => setUpdateMessage(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUpdate}>Post Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
