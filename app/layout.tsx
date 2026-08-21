export const metadata = {
  title: 'Call Evaluator',
  description: 'AI-powered call quality evaluation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
