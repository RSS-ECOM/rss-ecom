import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Heavy Metal',
  description: 'Welcome to HeavyMetal - your digital armory for all things metallic!',
};

export default function HomePage(): JSX.Element {
  return (
    <main className="main-content">
      <section className="hero-section">
        <div className="container">
          <h1>Welcome to HeavyMetal</h1>
          <p>Looking to protect yourself or deal some damage?</p>
        </div>
      </section>
    </main>
  );
}
