import PlaceholderPage from '../../components/common/PlaceholderPage';

export default function NewComplaintPage() {
  return (
    <PlaceholderPage
      title="File a complaint"
      route="/complaints/new/:scanId"
      purpose="Escalate a non-compliant scan toward enforcement."
    />
  );
}
