'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  useEffect(() => {
    // log the error
  }, [error]);

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button className="reset-button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
