import { NextRequest, NextResponse } from 'next/server';
import { getLatestEdition, getEditionById, getSubscribers, updateSubscriberDispatch } from '@/lib/db';
import { generateNewsletterHtml, sendDailyNewsletter } from '@/lib/email';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const editionId = searchParams.get('editionId');
  const edition = editionId ? getEditionById(editionId) : getLatestEdition();

  if (!edition) {
    return NextResponse.json({ error: 'No edition available to preview.' }, { status: 404 });
  }

  const html = generateNewsletterHtml(edition);
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { editionId, testEmail, sendToAll } = body;

    const edition = editionId ? getEditionById(editionId) : getLatestEdition();
    if (!edition) {
      return NextResponse.json({ error: 'No edition available to dispatch.' }, { status: 404 });
    }

    let targetEmails: string[] = [];
    if (testEmail) {
      targetEmails = [testEmail];
    } else if (sendToAll) {
      const subscribers = getSubscribers().filter(s => s.active);
      targetEmails = subscribers.map(s => s.email);
      if (!targetEmails.length) {
        targetEmails = ['sample.subscriber@dailyledger.com'];
      }
    } else {
      targetEmails = ['reader@dailyledger.com'];
    }

    const result = await sendDailyNewsletter(edition, targetEmails);
    if (result.success && sendToAll) {
      updateSubscriberDispatch(targetEmails);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Dispatch failed.' }, { status: 500 });
  }
}
