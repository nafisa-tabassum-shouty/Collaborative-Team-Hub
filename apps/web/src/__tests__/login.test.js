import { render, screen } from '@testing-library/react';
import LoginPage from '../app/(auth)/login/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Zustand stores
jest.mock('@/store/authStore', () => ({
  __esModule: true,
  default: () => ({
    login: jest.fn(),
    isLoading: false,
  }),
}));

jest.mock('@/store/commandStore', () => ({
  __esModule: true,
  default: () => ({
    isOpen: false,
  }),
}));

describe('LoginPage', () => {
  it('renders login form correctly', () => {
    render(<LoginPage />);
    
    expect(screen.getByPlaceholderText(/email@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
