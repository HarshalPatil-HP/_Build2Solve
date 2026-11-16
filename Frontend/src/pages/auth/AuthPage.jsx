import SlidingAuthPanel from '../../components/auth/SlidingAuthPanel';

export default function AuthPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center gap-6 bg-bg p-4 font-sans">
      <h1 className="text-center text-2xl font-extrabold text-primary">SahiScan | सही स्कैन</h1>
      <SlidingAuthPanel />
      <footer className="max-w-xl text-center text-sm text-text-secondary">AI findings are advisory and must be verified by an inspector.</footer>
    </div>
  );
}
