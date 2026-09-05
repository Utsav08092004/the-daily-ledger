import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, getSubscribers } from '@/lib/db';

export async function GET() {
  const subscribers = getSubscribers();
  return NextResponse.json({
    total: subscribers.length,
    subscribers
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, topics } = body;

    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const result = await addSubscriber(email, name, topics);
    return NextResponse.json({
      success: true,
      message: result.isNew 
        ? 'Welcome to Prosperon! You will receive your daily financial briefing every morning.' 
        : 'Your subscription preferences have been updated!',
      subscriber: result.subscriber
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Subscription failed.' }, { status: 500 });
  }
}
