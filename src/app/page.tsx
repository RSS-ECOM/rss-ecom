import type { Metadata } from 'next';

import Link from 'next/link';

export const metadata: Metadata = {
  description: 'Welcome to HeavyMetal - your digital armory for all things metallic!',
  title: 'Home | Heavy Metal',
};

export default function HomePage(): JSX.Element {
  return (
    <main className="main-content">
      <section className="hero-section">
        <div className="container">
          <h1>Welcome to HeavyMetal</h1>
          <p>Looking to protect yourself or deal some damage?</p>
          <nav className="flex gap-4">
            <Link className="text-4xl" href="/login">
              Login
            </Link>
            <Link href="/sign-up">Sign up</Link>
          </nav>
        </div>
      </section>
    </main>
  );
}
