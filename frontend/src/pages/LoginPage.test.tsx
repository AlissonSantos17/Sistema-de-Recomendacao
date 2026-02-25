import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../auth/AuthContext';
import LoginPage from './LoginPage';

const navigateMock = vi.fn();
const checkUserExistsMock = vi.fn();
const getHealthMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock('../services/recommendations', () => ({
  checkUserExists: (...args: unknown[]) => checkUserExistsMock(...args),
  getHealth: (...args: unknown[]) => getHealthMock(...args)
}));

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    navigateMock.mockReset();
    checkUserExistsMock.mockReset();
    getHealthMock.mockReset();
    getHealthMock.mockResolvedValue({
      status: 'ok',
      service: 'movie-recommendation-backend',
      version: '2.0.0'
    });
  });

  it('valida ID numerico antes de chamar a API', async () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('ID do usuario'), {
      target: { value: 'abc' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(
      await screen.findByText('Informe um ID numerico valido.')
    ).toBeInTheDocument();
    expect(checkUserExistsMock).not.toHaveBeenCalled();
  });

  it('realiza login e navega para dashboard', async () => {
    checkUserExistsMock.mockResolvedValue({ userId: '1', exists: true });

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('ID do usuario'), {
      target: { value: '1' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(checkUserExistsMock).toHaveBeenCalledWith('1');
      expect(navigateMock).toHaveBeenCalledWith('/recomendacao');
    });
  });
});
