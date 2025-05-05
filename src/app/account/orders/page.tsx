import React from 'react';

export default function OrdersPage(): React.JSX.Element {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-600 mb-4">You haven&apos;t placed any orders yet.</p>

        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
