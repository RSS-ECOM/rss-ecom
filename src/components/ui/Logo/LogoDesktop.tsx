import Image from 'next/image';
import Link from 'next/link';

interface LogoDesktopProps {
  className?: string;
}

export default function LogoDesktop({ className }: LogoDesktopProps): JSX.Element {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/img/svg/logo-wide.svg"
        alt="Story Hive"
        width={160}
        height={40}
        className={`h-9 w-auto ${className}`}
        priority
      />
    </Link>
  );
}
