export default function PrivacyPage() {
  return <>
    <header className="article-shell article-nav"><a href="/" style={{textDecoration:'none'}} className="brand">Signal AI</a><a href="/" style={{color:'#aaa89f'}}>← Back</a></header>
    <main className="article-shell privacy-page">
      <h1>Privacy</h1>
      <p>Signal AI only collects the email address you submit when you subscribe.</p>
      <p>We use that address to send the Signal AI newsletter twice a week. Subscriber data is processed by our email delivery provider, Resend. We do not sell subscriber data.</p>
      <p>Every newsletter includes an unsubscribe link. You can unsubscribe at any time, after which Resend will mark your contact as unsubscribed and future Broadcasts will skip your address.</p>
      <p>If you want your contact record removed entirely, contact the publisher using the contact method provided with the newsletter.</p>
      <p>This policy may be updated if Signal AI adds new features or providers.</p>
      <p className="privacy-updated">Last updated: 22 October 2026.</p>
    </main>
  </>;
}
