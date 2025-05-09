import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '../ThemeToggle';
import { TestWrapper } from '../../test/test-utils';

// Mock Font Awesome icons
vi.mock('react-icons/fa', () => ({
  FaSun: () => <span data-testid="fa-sun">Sun Icon</span>,
  FaMoon: () => <span data-testid="fa-moon">Moon Icon</span>
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const renderThemeToggle = () => {
  return render(
    <ThemeToggle />,
    { wrapper: TestWrapper }
  );
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('light');
  });

  it('should render moon icon in light mode', () => {
    renderThemeToggle();
    expect(screen.getByTestId('fa-moon')).toBeDefined();
  });

  it('should render sun icon in dark mode', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');
    renderThemeToggle();
    expect(screen.getByTestId('fa-sun')).toBeDefined();
  });

  it('should toggle theme when clicked', async () => {
    const user = userEvent.setup();
    renderThemeToggle();

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should have correct aria-label', () => {
    renderThemeToggle();
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to dark mode');
  });
}); 