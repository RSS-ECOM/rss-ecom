import { Book } from 'lucide-react';
import Link from 'next/link';

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-background border-t py-6 md:py-10">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Story Hive</span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link className="hover:text-foreground" href="/about">
              About
            </Link>
            <Link className="hover:text-foreground" href="/contact">
              Contact
            </Link>
            <Link className="hover:text-foreground" href="https://app.rs.school/">
              RSSchool
            </Link>
          </nav>

          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Story Hive. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
