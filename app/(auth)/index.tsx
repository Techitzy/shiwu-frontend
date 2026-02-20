// Default entry for the (auth) group.
// The actual destination (walkthrough vs login) is decided by _layout.tsx
// via router.replace(), so this component is practically never rendered.
import { Redirect } from 'expo-router';

export default function AuthIndex() {
    return <Redirect href="/(auth)/login" />;
}
