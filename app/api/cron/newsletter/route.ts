import { NextResponse } from 'next/server';
import { buildEdition } from '../../../../lib/newsletter';

export async function GET(req:Request) {
  if (process.env.ENABLE_PAID_AUTOMATION !== 'true') {
    return NextResponse.json({
      ok:false,
      mode:'manual',
      message:'Paid API generation is disabled. Signal AI currently uses the ChatGPT scheduled task plus manual Broadcast publishing.'
    }, {status:503});
  }

  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized',{status:401});
  }

  // This route intentionally only generates in the public portfolio repo.
  // Wire `edition` to your chosen delivery provider only when moving to production.
  const edition = await buildEdition();
  return NextResponse.json({ok:true, edition, delivery:'not-configured'});
}
