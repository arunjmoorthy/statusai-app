import { NextRequest, NextResponse } from 'next/server';

// Subscription API - works in demo mode without Supabase
// Will integrate with Supabase when database is connected

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, statusPageId } = body;

    if (!email || !statusPageId) {
      return NextResponse.json(
        { error: 'Email and statusPageId are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // Demo mode - just log and return success
      console.log('Demo subscription:', { email, statusPageId, timestamp: new Date().toISOString() });
      return NextResponse.json({
        success: true,
        message: 'Subscribed successfully! You will receive updates about incidents.',
        isDemo: true,
      });
    }

    // TODO: Implement full Supabase integration
    // For now, return success in demo mode
    console.log('Subscription request:', { email, statusPageId });

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully! You will receive updates about incidents.',
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const statusPageId = searchParams.get('statusPageId');

    if (!email || !statusPageId) {
      return NextResponse.json(
        { error: 'Email and statusPageId are required' },
        { status: 400 }
      );
    }

    // Demo mode response
    console.log('Unsubscribe request:', { email, statusPageId });

    return NextResponse.json({
      success: true,
      message: 'You have been unsubscribed from status updates.',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
