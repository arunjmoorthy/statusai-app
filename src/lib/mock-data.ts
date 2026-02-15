// Mock data for StatusAI MVP
// Will be replaced with Supabase integration

import { StatusPage, Component, Incident, IncidentUpdate } from './types';

export const mockComponents: Component[] = [
  {
    id: 'comp-1',
    name: 'API',
    description: 'Core API endpoints',
    status: 'operational',
    order: 1,
  },
  {
    id: 'comp-2',
    name: 'Web Application',
    description: 'Main web dashboard',
    status: 'operational',
    order: 2,
  },
  {
    id: 'comp-3',
    name: 'Database',
    description: 'Primary database cluster',
    status: 'operational',
    order: 3,
  },
  {
    id: 'comp-4',
    name: 'CDN',
    description: 'Content delivery network',
    status: 'operational',
    order: 4,
  },
  {
    id: 'comp-5',
    name: 'Authentication',
    description: 'User authentication service',
    status: 'operational',
    order: 5,
  },
];

export const mockIncidentUpdates: IncidentUpdate[] = [
  {
    id: 'update-1',
    incidentId: 'inc-1',
    status: 'resolved',
    message: 'The issue has been fully resolved. All services are operating normally. We have implemented additional monitoring to prevent similar issues in the future.',
    createdAt: new Date('2026-02-14T15:30:00Z'),
    isAIGenerated: true,
  },
  {
    id: 'update-2',
    incidentId: 'inc-1',
    status: 'monitoring',
    message: 'We have deployed a fix and are monitoring the system. Response times are returning to normal levels.',
    createdAt: new Date('2026-02-14T15:00:00Z'),
    isAIGenerated: false,
  },
  {
    id: 'update-3',
    incidentId: 'inc-1',
    status: 'identified',
    message: 'We have identified the root cause as a misconfigured cache invalidation rule. Our team is implementing a fix.',
    createdAt: new Date('2026-02-14T14:30:00Z'),
    isAIGenerated: true,
  },
  {
    id: 'update-4',
    incidentId: 'inc-1',
    status: 'investigating',
    message: 'We are investigating reports of increased latency on the API. Some users may experience slower response times.',
    createdAt: new Date('2026-02-14T14:00:00Z'),
    isAIGenerated: false,
  },
];

export const mockIncidents: Incident[] = [
  {
    id: 'inc-1',
    title: 'Elevated API Response Times',
    status: 'resolved',
    severity: 'minor',
    affectedComponents: ['comp-1'],
    updates: mockIncidentUpdates.filter(u => u.incidentId === 'inc-1'),
    createdAt: new Date('2026-02-14T14:00:00Z'),
    resolvedAt: new Date('2026-02-14T15:30:00Z'),
  },
];

export const mockStatusPage: StatusPage = {
  id: 'page-1',
  name: 'Acme Corp',
  subdomain: 'acme',
  components: mockComponents,
  incidents: mockIncidents,
  primaryColor: '#3B82F6',
  createdAt: new Date('2026-01-01T00:00:00Z'),
};

// In-memory store for the MVP (will be replaced with Supabase)
let statusPageData = { ...mockStatusPage };

export function getStatusPage(): StatusPage {
  return statusPageData;
}

export function updateComponentStatus(componentId: string, status: Component['status']): void {
  statusPageData = {
    ...statusPageData,
    components: statusPageData.components.map(c =>
      c.id === componentId ? { ...c, status } : c
    ),
  };
}

export function addIncident(incident: Omit<Incident, 'id' | 'updates' | 'createdAt'>): Incident {
  const newIncident: Incident = {
    ...incident,
    id: `inc-${Date.now()}`,
    updates: [],
    createdAt: new Date(),
  };

  statusPageData = {
    ...statusPageData,
    incidents: [newIncident, ...statusPageData.incidents],
  };

  return newIncident;
}

export function addIncidentUpdate(
  incidentId: string,
  update: Omit<IncidentUpdate, 'id' | 'incidentId' | 'createdAt'>
): IncidentUpdate {
  const newUpdate: IncidentUpdate = {
    ...update,
    id: `update-${Date.now()}`,
    incidentId,
    createdAt: new Date(),
  };

  statusPageData = {
    ...statusPageData,
    incidents: statusPageData.incidents.map(inc =>
      inc.id === incidentId
        ? {
            ...inc,
            updates: [newUpdate, ...inc.updates],
            status: update.status,
            resolvedAt: update.status === 'resolved' ? new Date() : inc.resolvedAt,
          }
        : inc
    ),
  };

  return newUpdate;
}

export function getActiveIncidents(): Incident[] {
  return statusPageData.incidents.filter(inc => inc.status !== 'resolved');
}

export function getRecentIncidents(limit = 10): Incident[] {
  return statusPageData.incidents.slice(0, limit);
}
