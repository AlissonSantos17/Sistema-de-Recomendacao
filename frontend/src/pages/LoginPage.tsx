import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getFriendlyErrorMessage } from '../services/error';
import { checkUserExists, getHealth } from '../services/recommendations';
import { ApiError, HealthResponse } from '../types/api';

const onlyDigits = /^\d+$/;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userIdInput, setUserIdInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [health, setHealth] = useState<HealthResponse | null>(null);

  const isUserIdValid = useMemo(
    () => userIdInput.length > 0 && onlyDigits.test(userIdInput),
    [userIdInput]
  );

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch(() => {
        setHealth(null);
      });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isUserIdValid) {
      setMessage('Informe um ID numerico valido.');
      return;
    }

    setMessage('');
    setIsSubmitting(true);

    try {
      const result = await checkUserExists(userIdInput);
      if (!result.exists) {
        setMessage('Usuario nao encontrado. Verifique o ID informado.');
        return;
      }

      login(result.userId);
      navigate('/recomendacao');
    } catch (error) {
      setMessage(getFriendlyErrorMessage(error as ApiError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-card panel">
        <p className="auth-card__eyebrow">Movie Social Discovery</p>
        <h1>Sistema de Recomendacao de Filmes</h1>
        <p className="auth-card__subtitle">
          Entre com seu ID para visualizar seus filmes favoritos e novas
          recomendacoes personalizadas.
        </p>
        {health ? (
          <p className="auth-card__health">
            API: {health.service} v{health.version} ({health.status})
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="user-id-input">ID do usuario</label>
          <input
            id="user-id-input"
            type="text"
            inputMode="numeric"
            placeholder="Ex.: 1"
            value={userIdInput}
            onChange={(event) => setUserIdInput(event.target.value.trim())}
            aria-invalid={Boolean(message)}
            aria-describedby="login-message"
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Validando...' : 'Entrar'}
          </button>
        </form>

        <p id="login-message" className="auth-card__message" role="status">
          {message}
        </p>
      </section>
    </main>
  );
}
