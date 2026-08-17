import { Header } from './components/Header';
import { EmptyState } from './components/EmptyState';

const APP_TITLE = 'Override Studio';
const EMPTY_MESSAGE = 'No override rules created';

/**
 * Root popup component. For now it only renders the shell: title, the primary
 * action, and an empty state. The rule editor and rule list are not built yet.
 */
export function App() {
  const handleCreateOverride = () => {
    // Placeholder: the rule editor is not implemented in this foundation phase.
    console.info('Create Override clicked - rule editor not implemented yet.');
  };

  return (
    <div className="app">
      <Header title={APP_TITLE} onCreateOverride={handleCreateOverride} />
      <main className="app__content">
        <EmptyState message={EMPTY_MESSAGE} />
      </main>
    </div>
  );
}
