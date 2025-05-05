/* eslint-disable import/no-extraneous-dependencies */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import RootLayout from '../layout';

describe('RootLayout', () => {
  it('renders the layout with children', () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>,
    );

    expect(screen.getByTestId('test-content')).toBeDefined();
    expect(screen.getByText('Test Content')).toBeDefined();
  });
});
