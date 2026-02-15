// Core types for StatusAI

export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved';
export type IncidentSeverity = 'minor' | 'major' | 'critical';
export type ComponentStatus = 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance';

export interface IncidentUpdate {
  id: string;
  incidentId: string;
  status: IncidentStatus;
  message: string;
  createdAt: Date;
  isAIGenerated: boolean;
}

export interface Incident {
  id: string;
  title: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  affectedComponents: string[];
  updates: IncidentUpdate[];
  createdAt: Date;
  resolvedAt?: Date;
}

export interface Component {
  id: string;
  name: string;
  description?: string;
  status: ComponentStatus;
  order: number;
}

export interface StatusPage {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  components: Component[];
  incidents: Incident[];
  logoUrl?: string;
  primaryColor: string;
  createdAt: Date;
}

// Helper functions for status display
export const statusColors: Record<ComponentStatus, string> = {
  operational: 'bg-green-500',
  degraded: 'bg-yellow-500',
  partial_outage: 'bg-orange-500',
  major_outage: 'bg-red-500',
  maintenance: 'bg-blue-500',
};

export const statusLabels: Record<ComponentStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded Performance',
  partial_outage: 'Partial Outage',
  major_outage: 'Major Outage',
  maintenance: 'Under Maintenance',
};

export const incidentStatusColors: Record<IncidentStatus, string> = {
  investigating: 'bg-red-500',
  identified: 'bg-orange-500',
  monitoring: 'bg-yellow-500',
  resolved: 'bg-green-500',
};

export const incidentStatusLabels: Record<IncidentStatus, string> = {
  investigating: 'Investigating',
  identified: 'Identified',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
};

export const severityColors: Record<IncidentSeverity, string> = {
  minor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  major: 'bg-orange-100 text-orange-800 border-orange-300',
  critical: 'bg-red-100 text-red-800 border-red-300',
};
