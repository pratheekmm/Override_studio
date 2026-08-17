interface HeaderProps {
  title: string;
  onCreateOverride: () => void;
}

/** Popup header: application title and the primary "Create Override" action. */
export function Header({ title, onCreateOverride }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">{title}</h1>
      <button
        type="button"
        className="button button--primary"
        onClick={onCreateOverride}
      >
        Create Override
      </button>
    </header>
  );
}
