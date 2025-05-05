/* eslint-disable import/no-extraneous-dependencies */
import LayoutContent from '@/components/layout/LayoutContent/LayoutContent';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('LayoutContent', () => {
  it('renders the layout content with children', () => {
    render(
      <LayoutContent>
        <div data-testid="test-content">Test Content</div>
      </LayoutContent>,
    );

    expect(screen.getByTestId('test-content')).toBeDefined();
    expect(screen.getByText('Test Content')).toBeDefined();
  });
});
