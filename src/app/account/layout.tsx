import React from 'react';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps): React.JSX.Element {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <aside className="w-full md:w-64 p-4 bg-gray-100 rounded">
        <h3 className="font-bold text-lg">Account</h3>
        <nav className="mt-4">
          <ul>
            <li className="mb-2">Profile</li>
            <li className="mb-2">Orders</li>
            <li className="mb-2">Settings</li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
