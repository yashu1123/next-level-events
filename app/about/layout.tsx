import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'About Us | Next Level Events',
  description: 'Meet Next Level Events, our performers, our multilingual entertainment, and our mission to create unforgettable celebrations across Karnataka.',
};
export default function AboutLayout({ children }: { children: React.ReactNode }) { return children; }
