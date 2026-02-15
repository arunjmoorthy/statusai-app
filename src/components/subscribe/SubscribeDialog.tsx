'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, Mail, Smartphone } from 'lucide-react';

interface SubscribeDialogProps {
  trigger?: React.ReactNode;
}

export function SubscribeDialog({ trigger }: SubscribeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    // Simulate API call (will be replaced with real backend)
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubscribed(true);

    // Reset after 2 seconds
    setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 300);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Subscribe to Updates
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {isSubscribed ? (
          <div className="py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">You&apos;re subscribed!</h3>
            <p className="text-muted-foreground">
              We&apos;ll notify you when there are status updates.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Subscribe to Status Updates</DialogTitle>
              <DialogDescription>
                Get notified when there are incidents or scheduled maintenance.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubscribe}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">
                    Coming Soon
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    SMS notifications
                  </div>
                </div>

                <div className="rounded-lg border p-3 bg-muted/50">
                  <p className="text-xs text-muted-foreground">
                    We only send emails when there&apos;s a service incident or scheduled
                    maintenance. No spam, ever. Unsubscribe anytime.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !email.trim()}>
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
