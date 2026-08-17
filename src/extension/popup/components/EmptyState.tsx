interface EmptyStateProps {
  message: string;
}

/** Shown when there are no mock rules to display. */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-state__message">{message}</p>
    </div>
  );
}
