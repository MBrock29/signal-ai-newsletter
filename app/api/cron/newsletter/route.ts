import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { buildEdition, renderHtml } from '../../../../lib/newsletter';

export const maxDuration = 300;

export async function GET(req: Request) {
  if (process.env.ENABLE_PAID_AUTOMATION !== 'true') {
    return NextResponse.json(
      {
        ok: false,
        mode: 'manual',
        message: 'Paid API generation is disabled.',
      },
      { status: 503 },
    );
  }

  if (
    req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const required = [
    'OPENROUTER_API_KEY',
    'RESEND_API_KEY',
    'RESEND_SEGMENT_ID',
    'RESEND_FROM',
  ] as const;

  const missing = required.filter((name) => !process.env[name]);

  if (missing.length) {
    return NextResponse.json(
      {
        ok: false,
        error: `Missing environment variables: ${missing.join(', ')}`,
      },
      { status: 500 },
    );
  }

  try {
    console.log('Signal AI: starting generation');

    const edition = await buildEdition();

    console.log('Signal AI: generation complete');

    const html = renderHtml(edition);

    console.log('Signal AI: creating Resend draft');

    const resend = new Resend(process.env.RESEND_API_KEY!);

    const { data, error } = await resend.broadcasts.create({
      segmentId: process.env.RESEND_SEGMENT_ID!,
      from: process.env.RESEND_FROM!,
      subject: 'Signal AI: 5 AI reads worth your time',
      html,
      topicId: process.env.RESEND_TOPIC_ID!,
      previewText: 'Five worthwhile AI reads. About 15 minutes.',
    });

    console.log('Signal AI: Resend draft request complete');

    if (error) {
      console.error('Resend broadcast creation failed', error);

      return NextResponse.json({ ok: false, error }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      broadcastId: data?.id,
      status: 'draft',
      editionTitle: edition.editionTitle,
      items: edition.items.length,
      message:
        'Edition generated and saved as a Resend draft. Nothing was sent automatically.',
    });
  } catch (error) {
    console.error('Signal AI generation failed', error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
