'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageEventsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/events/my-events');
  }, [router]);

  return null;
}
