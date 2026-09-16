import PlaceholderPage from '../../components/common/PlaceholderPage';

export default function ResetPasswordPage() {
  return (
    <PlaceholderPage
      title="Reset password"
      route="/auth/reset-password/:token"
      purpose="Set a new password from the emailed token."
    />
  );
}
