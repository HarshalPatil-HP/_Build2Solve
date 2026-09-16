import { AuthPreviewProvider } from './context/AuthPreviewContext';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <AuthPreviewProvider>
      <AppRouter />
    </AuthPreviewProvider>
  );
}
