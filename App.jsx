import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import storageService from './src/services/storageService';

import { useFonts } from 'expo-font';
import { Text } from 'react-native';

export default function App() {

  const [fontsLoaded] = useFonts({
    Inter: require('./assets/fonts/Inter_28pt-Regular.ttf'),
    InterMedium: require('./assets/fonts/Inter_28pt-Medium.ttf'),
    InterBold: require('./assets/fonts/Inter_28pt-Bold.ttf'),
  });

  useEffect(() => {
    storageService.initialize().catch(err => {
      console.error('[App] Failed to initialize storage:', err);
    });
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}