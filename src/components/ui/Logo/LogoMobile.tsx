import Image from 'next/image';
import Link from 'next/link';

export default function LogoMobile() {
  return (
    <Link href="/" className="flex items-center">
      <Image src="/img/svg/logo.svg" alt="Story Hive" width={48} height={48} className="h-8 w-auto" priority />
    </Link>
  );
}
