import PlaceholderPage from '../../components/common/PlaceholderPage';

export default function OfflinePage() {
  return (
    <PlaceholderPage
      title="You are offline"
      route="/offline"
      purpose="PWA fallback when a route is not cached."
    />
  );
}
