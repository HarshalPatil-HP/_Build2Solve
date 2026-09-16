import PlaceholderPage from '../../components/common/PlaceholderPage';

export default function ForgotPasswordPage() {
  return (
    <PlaceholderPage
      title="Forgot password"
      route="/auth/forgot-password"
      purpose="Request a password reset link without leaking whether the email exists."
    />
  );
}
