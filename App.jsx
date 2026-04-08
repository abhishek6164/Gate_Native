import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import storageService from './src/services/storageService';

export default function App() {
  useEffect(() => {
    // Initialize storage on app startup
    storageService.initialize().catch(err => {
      console.error('[App] Failed to initialize storage:', err);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}