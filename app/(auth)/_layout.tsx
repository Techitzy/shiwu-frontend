import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="walkthrough" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="register" />
      <Stack.Screen name="role-selection" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="email-sent" />
      <Stack.Screen name="set-password" />
      <Stack.Screen name="verifying" />
    </Stack>
  );
}
