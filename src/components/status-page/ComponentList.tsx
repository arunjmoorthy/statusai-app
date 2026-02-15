'use client';

import { Component, statusColors, statusLabels } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface ComponentListProps {
  components: Component[];
}

export function ComponentList({ components }: ComponentListProps) {
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {sortedComponents.map((component) => (
            <div
              key={component.id}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium">{component.name}</h3>
                {component.description && (
                  <p className="text-sm text-muted-foreground">
                    {component.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {statusLabels[component.status]}
                </span>
                <div
                  className={`h-3 w-3 rounded-full ${statusColors[component.status]}`}
                  title={statusLabels[component.status]}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
