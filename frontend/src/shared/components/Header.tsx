interface HeaderProps {
  userId: string;
  onLogout: () => void;
}

export default function Header({ userId, onLogout }: HeaderProps) {
  return (
    <header className="header panel">
      <div>
        <p className="header__eyebrow">Descoberta social de filmes</p>
        <h1 className="header__title">Sistema de Recomendacao</h1>
      </div>
      <div className="header__meta">
        <span className="header__user">Usuario #{userId}</span>
        <button type="button" className="header__button" onClick={onLogout}>
          Sair
        </button>
      </div>
    </header>
  );
}
