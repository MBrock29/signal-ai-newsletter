import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const website = String(body?.website || '').trim();

    // Honeypot: bots often fill hidden fields. Return success without creating a contact.
    if (website) {
      return NextResponse.json({ ok: true, message: 'You’re subscribed.' });
    }

    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const segmentId = process.env.RESEND_SEGMENT_ID;

    if (!apiKey || !segmentId) {
      console.error('Missing RESEND_API_KEY or RESEND_SEGMENT_ID');
      return NextResponse.json(
        { error: 'Subscriptions are temporarily unavailable. Please try again later.' },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.contacts.create({
      email,
      unsubscribed: false,
      segments: [{ id: segmentId }],
    });

    if (error) {
      // Resend contacts are globally keyed by email. Treat an existing contact as a
      // successful signup rather than exposing account state to the visitor.
      const errorName = String((error as { name?: string }).name || '').toLowerCase();
      const errorMessage = String((error as { message?: string }).message || '').toLowerCase();
      const duplicate = errorName.includes('conflict') || errorMessage.includes('already') || errorMessage.includes('exist');

      if (!duplicate) {
        console.error('Resend contact creation failed:', error);
        return NextResponse.json(
          { error: 'We couldn’t save your subscription. Please try again.' },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({
      ok: true,
      contactId: data?.id,
      message: 'You’re subscribed. The next Signal AI edition will arrive twice a week.',
    });
  } catch (error) {
    console.error('Subscription route failed:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
