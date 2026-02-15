'use client';

import { Incident, incidentStatusColors, incidentStatusLabels, severityColors } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow, format } from 'date-fns';
import { Sparkles, Clock } from 'lucide-react';

interface IncidentTimelineProps {
  incidents: Incident[];
  showResolved?: boolean;
  limit?: number;
}

export function IncidentTimeline({
  incidents,
  showResolved = true,
  limit,
}: IncidentTimelineProps) {
  let displayIncidents = showResolved
    ? incidents
    : incidents.filter((inc) => inc.status !== 'resolved');

  if (limit) {
    displayIncidents = displayIncidents.slice(0, limit);
  }

  if (displayIncidents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No incidents to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {displayIncidents.map((incident) => (
        <Card key={incident.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg">{incident.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className={severityColors[incident.severity]}
                  >
                    {incident.severity}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${incidentStatusColors[incident.status]}`}
                    />
                    {incidentStatusLabels[incident.status]}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(incident.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incident.updates.map((update, index) => (
                <div key={update.id}>
                  {index > 0 && <Separator className="mb-4" />}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-3 w-3 rounded-full ${incidentStatusColors[update.status]} mt-1`}
                      />
                      {index < incident.updates.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {incidentStatusLabels[update.status]}
                        </span>
                        {update.isAIGenerated && (
                          <Badge
                            variant="outline"
                            className="text-xs flex items-center gap-1 text-purple-600 border-purple-300"
                          >
                            <Sparkles className="h-3 w-3" />
                            AI Generated
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {format(new Date(update.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {update.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
