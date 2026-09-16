import SlidingAuthPanel from '../../components/auth/SlidingAuthPanel';

export default function AuthPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <SlidingAuthPanel />
    </div>
  );
}
