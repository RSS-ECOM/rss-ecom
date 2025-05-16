import type { Metadata } from 'next';

import UnderDevelopment from '@/components/layout/UnderDevelopment/UnderDevelopment';

export const metadata: Metadata = {
  description: 'View and manage your order history',
  title: 'My Orders - Account',
};

export default function OrdersPage(): JSX.Element {
  return (
    <UnderDevelopment
      message="We're currently working on implementing this feature. Please check back soon!"
      returnLabel="Return to Homepage"
      returnPath="/"
      title="Feature Coming Soon"
    />
  );
}
