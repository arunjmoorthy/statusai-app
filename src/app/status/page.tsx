import Link from 'next/link';
import { OverallStatus, ComponentList, IncidentTimeline } from '@/components/status-page';
import { mockStatusPage } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Bell, Sparkles, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'System Status - Acme Corp',
  description: 'Real-time status and incident updates for Acme Corp services',
};

export default function StatusPage() {
  const statusPage = mockStatusPage;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <div>
                <h1 className="font-bold text-lg">{statusPage.name}</h1>
                <p className="text-sm text-muted-foreground">System Status</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Subscribe to Updates
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Overall Status Banner */}
        <OverallStatus components={statusPage.components} />

        {/* Components Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Components</h2>
          <ComponentList components={statusPage.components} />
        </section>

        <Separator />

        {/* Active Incidents */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Active Incidents</h2>
          <IncidentTimeline
            incidents={statusPage.incidents}
            showResolved={false}
          />
          {statusPage.incidents.filter(i => i.status !== 'resolved').length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No active incidents. All systems are operating normally.
            </div>
          )}
        </section>

        <Separator />

        {/* Past Incidents */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Past Incidents</h2>
          <IncidentTimeline
            incidents={statusPage.incidents.filter(i => i.status === 'resolved')}
            showResolved={true}
            limit={5}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to StatusAI
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Powered by
              <Link href="/" className="flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors">
                <Sparkles className="h-4 w-4" />
                StatusAI
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
