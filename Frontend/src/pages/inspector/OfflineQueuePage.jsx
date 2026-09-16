import PlaceholderPage from '../../components/common/PlaceholderPage';

export default function OfflineQueuePage() {
  return (
    <PlaceholderPage
      title="Offline scan queue"
      route="/inspector/offline-queue"
      purpose="IndexedDB queue of scans waiting to sync."
    />
  );
}
