import { useEffect } from 'react';
import { ExpenseProvider } from '@/context/ExpenseContext';
import { Navbar } from '@/components/Navbar';
import { Dashboard } from '@/pages/Dashboard';
import { useLocalStorage } from '@/hooks/useLocalStorage';

function App() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('expense-tracker:dark-mode', false);

  // Reflect the preference on the <html> element so Tailwind's `dark:` variants apply globally.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode((prev) => !prev)} />
        <Dashboard isDarkMode={isDarkMode} />
      </div>
    </ExpenseProvider>
  );
}

export default App;
