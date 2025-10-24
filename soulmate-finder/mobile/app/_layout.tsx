import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#ffffff',
          contentStyle: { backgroundColor: '#0f172a' }
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Soulmate Finder' }} />
      </Stack>
    </>
  );
}
