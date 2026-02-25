interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state state--error" role="alert">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="state__button">
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}
