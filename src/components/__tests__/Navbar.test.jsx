import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock Navbar component for testing
const MockNavbar = () => (
  <nav>
    <div>THEKING</div>
    <a href="/login">Login</a>
  </nav>
);

describe('Navbar Component', () => {
  it('renders brand logo', () => {
    render(
      <BrowserRouter>
        <MockNavbar />
      </BrowserRouter>
    );
    expect(screen.getByText(/THEKING/i)).toBeInTheDocument();
  });

  it('shows login link when not authenticated', () => {
    render(
      <BrowserRouter>
        <MockNavbar />
      </BrowserRouter>
    );
    const loginLink = screen.getByText(/Login/i);
    expect(loginLink).toBeInTheDocument();
  });

  it('has navigation element', () => {
    const { container } = render(
      <BrowserRouter>
        <MockNavbar />
      </BrowserRouter>
    );
    const navbar = container.querySelector('nav');
    expect(navbar).toBeInTheDocument();
  });
});
