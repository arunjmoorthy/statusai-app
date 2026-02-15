import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Zap,
  Shield,
  Bell,
  Code,
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">StatusAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/status" className="text-muted-foreground hover:text-foreground transition-colors">
                Demo Status Page
              </Link>
              <Link href="/dashboard">
                <Button>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered Status Pages
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Beautiful status pages.{' '}
            <span className="text-primary">Powered by AI.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Keep your customers informed with AI-generated incident updates,
            smart notifications, and stunning status pages that build trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/status">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why StatusAI?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The only status page platform built from the ground up with AI at its core.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="AI-Generated Updates"
              description="Never struggle to write incident updates again. Our AI crafts clear, professional communications in seconds."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Instant Setup"
              description="Get a beautiful status page live in under 5 minutes. No code required."
            />
            <FeatureCard
              icon={<Bell className="h-6 w-6" />}
              title="Smart Notifications"
              description="AI decides the best time and channel to notify your subscribers, reducing alert fatigue."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="99.99% Uptime"
              description="Your status page stays up even when your services are down. Hosted on global edge infrastructure."
            />
            <FeatureCard
              icon={<Code className="h-6 w-6" />}
              title="Developer-Friendly"
              description="Full API access, webhooks, and integrations with your existing monitoring tools."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Custom Domains"
              description="Use your own domain like status.yourcompany.com with free SSL certificates."
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground mb-8">Start free, scale when you need to.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              name="Free"
              price="$0"
              description="Perfect for side projects"
              features={['1 status page', '3 components', 'Basic AI updates', 'Email notifications']}
            />
            <PricingCard
              name="Pro"
              price="$29"
              description="For growing teams"
              features={['Unlimited pages', 'Unlimited components', 'Advanced AI features', 'Custom domain', 'API access']}
              highlighted
            />
            <PricingCard
              name="Team"
              price="$79"
              description="For larger organizations"
              features={['Everything in Pro', '5 team members', 'Priority support', 'SLA monitoring', 'Custom integrations']}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build trust with your customers?</h2>
          <p className="text-primary-foreground/80 mb-8">
            Join hundreds of companies using StatusAI to communicate better during incidents.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary">
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">StatusAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with AI, for the AI era.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <Card className={highlighted ? 'border-primary shadow-lg scale-105' : ''}>
      <CardHeader>
        {highlighted && (
          <Badge className="w-fit mb-2">Most Popular</Badge>
        )}
        <CardTitle>{name}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{price}</span>
          {price !== '$0' && <span className="text-muted-foreground">/month</span>}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
