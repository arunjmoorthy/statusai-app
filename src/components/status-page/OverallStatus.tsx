'use client';

import { Component, ComponentStatus } from '@/lib/types';
import { CheckCircle, AlertTriangle, XCircle, Wrench } from 'lucide-react';

interface OverallStatusProps {
  components: Component[];
}

function getOverallStatus(components: Component[]): {
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  message: string;
  icon: React.ReactNode;
  bgColor: string;
} {
  const statuses = components.map(c => c.status);

  if (statuses.every(s => s === 'operational')) {
    return {
      status: 'operational',
      message: 'All Systems Operational',
      icon: <CheckCircle className="h-8 w-8" />,
      bgColor: 'bg-green-500',
    };
  }

  if (statuses.some(s => s === 'major_outage')) {
    return {
      status: 'outage',
      message: 'Major System Outage',
      icon: <XCircle className="h-8 w-8" />,
      bgColor: 'bg-red-500',
    };
  }

  if (statuses.some(s => s === 'partial_outage')) {
    return {
      status: 'outage',
      message: 'Partial System Outage',
      icon: <AlertTriangle className="h-8 w-8" />,
      bgColor: 'bg-orange-500',
    };
  }

  if (statuses.some(s => s === 'maintenance')) {
    return {
      status: 'maintenance',
      message: 'Scheduled Maintenance',
      icon: <Wrench className="h-8 w-8" />,
      bgColor: 'bg-blue-500',
    };
  }

  return {
    status: 'degraded',
    message: 'Degraded Performance',
    icon: <AlertTriangle className="h-8 w-8" />,
    bgColor: 'bg-yellow-500',
  };
}

export function OverallStatus({ components }: OverallStatusProps) {
  const { message, icon, bgColor } = getOverallStatus(components);

  return (
    <div className={`${bgColor} rounded-lg p-6 text-white shadow-lg`}>
      <div className="flex items-center gap-4">
        {icon}
        <h2 className="text-2xl font-bold">{message}</h2>
      </div>
    </div>
  );
}
