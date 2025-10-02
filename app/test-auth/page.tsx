'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAuthPage() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.getSession();
    console.log('Session data:', data);
    console.log('Session error:', error);

    setSession(data.session);
    setUser(data.session?.user);
    setLoading(false);
  };

  useEffect(() => {
    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      console.log('New session:', session);
      setSession(session);
      setUser(session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkSession}>Refresh Session</Button>

          <div>
            <h3 className="font-semibold mb-2">Loading:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {loading ? 'Yes' : 'No'}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Has Session:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {session ? 'Yes' : 'No'}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">User:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Full Session:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
