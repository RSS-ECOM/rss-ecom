import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../ui/button';

describe('Button component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const buttonElement = screen.getByRole('button');
    await userEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders in disabled state when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });

  // variants
  it('renders with primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement.className).toContain('bg-primary');
  });

  it('renders with outline variant when specified', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement.className).toContain('border');
    expect(buttonElement.className).toContain('bg-background');
  });

  it('renders with ghost variant when specified', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement.className).toContain('hover:bg-accent');
    expect(buttonElement.className).not.toContain('bg-primary');
  });

  // sizes
  it('renders with default size', () => {
    render(<Button>Default Size</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement.className).toContain('h-9');
  });

  it('renders with small size when specified', () => {
    render(<Button size="sm">Small Button</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement.className).toContain('h-8');
  });

  it('renders with large size when specified', () => {
    render(<Button size="lg">Large Button</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement.className).toContain('h-10');
  });

  it('renders as a different element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    expect(link.className).toContain('inline-flex');
  });
});
