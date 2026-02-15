import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function AuthIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login as the default auth page
    router.replace('/auth/login');
  }, [router]);

  return null;
}
