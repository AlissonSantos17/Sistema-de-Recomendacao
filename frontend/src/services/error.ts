import { ApiError } from '../types/api';

const DEFAULT_ERROR_MESSAGE =
  'Nao foi possivel concluir a solicitacao. Tente novamente.';

export function normalizeApiError(error: unknown): ApiError {
  const maybeError = error as {
    response?: {
      status?: number;
      data?: {
        statusCode?: number;
        path?: string;
        timestamp?: string;
        message?: string | string[];
      };
    };
  };

  const statusCode =
    maybeError.response?.status ?? maybeError.response?.data?.statusCode ?? 500;

  const messagePayload = maybeError.response?.data?.message;
  const message = Array.isArray(messagePayload)
    ? messagePayload.join(' ')
    : messagePayload ?? DEFAULT_ERROR_MESSAGE;

  return {
    statusCode,
    path: maybeError.response?.data?.path ?? '',
    timestamp: maybeError.response?.data?.timestamp ?? new Date().toISOString(),
    message
  };
}

export function getFriendlyErrorMessage(error: ApiError): string {
  if (error.statusCode === 404 || error.statusCode === 422) {
    return 'Usuario nao encontrado. Verifique o ID informado e tente novamente.';
  }

  if (error.statusCode === 400) {
    return 'A requisicao foi rejeitada por parametro invalido.';
  }

  if (error.statusCode >= 500) {
    return 'Servico indisponivel no momento. Tente novamente em instantes.';
  }

  return error.message || DEFAULT_ERROR_MESSAGE;
}
