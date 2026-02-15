import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { incidentTitle, status, severity, previousUpdates, componentNames } = body;

    if (!incidentTitle || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: incidentTitle and status' },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a mock response if no API key (for demo purposes)
      const mockResponses: Record<string, string> = {
        investigating: `We are actively investigating reports of ${incidentTitle.toLowerCase()}. Our engineering team is analyzing system logs and metrics to identify the root cause. We will provide updates as more information becomes available.`,
        identified: `We have identified the root cause of ${incidentTitle.toLowerCase()}. Our team is implementing a fix and we expect the issue to be resolved shortly. Thank you for your patience.`,
        monitoring: `A fix has been deployed for ${incidentTitle.toLowerCase()}. We are actively monitoring the system to ensure stability. So far, all metrics indicate the issue has been resolved.`,
        resolved: `${incidentTitle} has been fully resolved. All affected services are now operating normally. We apologize for any inconvenience caused and have taken steps to prevent similar issues in the future.`,
      };

      return NextResponse.json({
        message: mockResponses[status] || mockResponses.investigating,
        isDemo: true,
      });
    }

    const systemPrompt = `You are a professional incident communication specialist for a SaaS company. Your job is to write clear, professional, and reassuring incident updates for a public status page.

Guidelines:
- Be concise but informative (2-4 sentences)
- Use professional language that builds trust
- Acknowledge the issue without blame
- Focus on what's being done and what customers can expect
- Never make promises about exact timing unless certain
- Be empathetic but not apologetic to excess
- Use active voice`;

    const userPrompt = `Write an incident update for the following:

Incident: ${incidentTitle}
Current Status: ${status}
Severity: ${severity || 'unknown'}
Affected Components: ${componentNames?.join(', ') || 'Not specified'}
${previousUpdates?.length ? `\nPrevious Updates:\n${previousUpdates.map((u: { status: string; message: string }) => `- ${u.status}: ${u.message}`).join('\n')}` : ''}

Write a professional status update for the "${status}" phase. The update should be suitable for public display on a status page.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    });

    const textContent = response.content.find(c => c.type === 'text');
    const message = textContent ? textContent.text : '';

    return NextResponse.json({ message });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate update' },
      { status: 500 }
    );
  }
}
