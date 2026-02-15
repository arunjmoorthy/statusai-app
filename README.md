# StatusAI

**The AI-native status page platform for modern SaaS companies.**

StatusAI helps you communicate incidents to your customers with AI-powered updates, beautiful status pages, and intelligent notifications.

![StatusAI Landing Page](https://via.placeholder.com/800x400?text=StatusAI+Preview)

## Features

- **AI-Generated Updates**: Never struggle to write incident updates again. Our AI crafts clear, professional communications in seconds using Claude.
- **Beautiful Status Pages**: Modern, responsive status pages that look great and build trust with your customers.
- **Real-time Incident Management**: Create and manage incidents with an intuitive dashboard.
- **Component Status Tracking**: Monitor the health of all your services at a glance.
- **Smart Notifications**: Keep your subscribers informed automatically.

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/arunjmoorthy/statusai-app.git
cd statusai-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Claude API key for AI features | Optional (uses mock without) |

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── status/           # Public status page
│   ├── dashboard/        # Incident management dashboard
│   └── api/              # API routes
│       └── ai/           # AI generation endpoints
├── components/
│   ├── ui/               # shadcn/ui components
│   └── status-page/      # Status page components
└── lib/
    ├── types.ts          # TypeScript types
    ├── mock-data.ts      # Mock data (will be replaced with DB)
    └── utils.ts          # Utility functions
```

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **AI**: [Anthropic Claude](https://www.anthropic.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Roadmap

- [ ] Supabase integration for persistence
- [ ] User authentication
- [ ] Email/SMS notifications
- [ ] Custom domains
- [ ] Integrations (Slack, PagerDuty, etc.)
- [ ] Public API
- [ ] Stripe payments

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | $0/mo | 1 status page, basic AI |
| Pro | $29/mo | Unlimited pages, advanced AI, custom domain |
| Team | $79/mo | 5 team members, integrations, priority support |
| Enterprise | $199/mo | SSO, SLAs, dedicated support |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with AI, for the AI era.
