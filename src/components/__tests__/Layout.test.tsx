import { describe, it, expect, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../Layout';

// Mock the ThemeToggle component
vi.mock('../ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>
}));

// Mock the Sidebar component
vi.mock('../Sidebar', () => ({
  default: () => <div data-testid="sidebar-content">Sidebar Content</div>
}));

// Mock the Outlet component from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet Content</div>
  };
});

vi.mock('../../assets/menu-food-left.svg?react', () => ({
  default: () => <svg data-testid="mock-logo" />,
}));

const renderLayout = () => {
  return render(
    <MemoryRouter>
      <Layout />
    </MemoryRouter>
  );
};

describe('Layout', () => {
  it('should render the basic layout structure', () => {
    renderLayout();

    // Check for main layout elements
    expect(screen.getByTestId('app-title').textContent).toBe('Todo App');
    expect(screen.getByTestId('theme-toggle')).toBeDefined();
    expect(screen.getByTestId('sidebar')).toBeDefined();
    expect(screen.getByTestId('main-content')).toBeDefined();
    expect(screen.getByTestId('footer')).toBeDefined();
    expect(screen.getByTestId('outlet')).toBeDefined();
  });

  it('should toggle sidebar on mobile when clicking the toggle button', async () => {
    const user = userEvent.setup();
    renderLayout();

    // Initially, sidebar should be hidden and no backdrop
    expect(screen.queryByTestId('sidebar-backdrop')).toBeNull();

    // Click the toggle button
    await act(async () => {
      await user.click(screen.getByTestId('sidebar-toggle'));
    });

    // Wait for the backdrop to appear (indicating sidebar is open)
    await waitFor(() => {
      expect(screen.getByTestId('sidebar-backdrop')).toBeDefined();
    });

    // Click the close button
    await act(async () => {
      await user.click(screen.getByTestId('sidebar-close'));
    });

    // Wait for the backdrop to disappear (indicating sidebar is closed)
    await waitFor(() => {
      expect(screen.queryByTestId('sidebar-backdrop')).toBeNull();
    });
  });

  it('should close sidebar when clicking the backdrop on mobile', async () => {
    const user = userEvent.setup();
    renderLayout();

    // Open the sidebar
    await act(async () => {
      await user.click(screen.getByTestId('sidebar-toggle'));
    });

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar.className).toContain('translate-x-0');

    // Click the backdrop
    await act(async () => {
      await user.click(screen.getByTestId('sidebar-backdrop'));
    });

    // Sidebar should be hidden
    expect(sidebar.className).toContain('-translate-x-full');
  });

  it('should render sidebar content', () => {
    renderLayout();
    expect(screen.getByTestId('sidebar-content')).toBeDefined();
  });

  it('should render the footer with copyright text', () => {
    renderLayout();
    const footer = screen.getByTestId('footer');
    expect(footer.textContent).toContain('© 2025 Todo App. All rights reserved.');
  });

  it('should render the main content area with outlet', () => {
    renderLayout();
    const mainContent = screen.getByTestId('main-content');
    expect(mainContent).toBeDefined();
    expect(screen.getByTestId('outlet')).toBeDefined();
  });

  it('should render the logo', () => {
    renderLayout();
    expect(screen.getByTestId('mock-logo')).toBeDefined();
  });
}); 