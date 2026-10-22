import './globals.css';

export const metadata = {
  title: 'Signal AI — Five worthwhile AI reads, twice a week',
  description: 'A deliberately anti-slop AI newsletter built around evidence, teaching value and source diversity.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
