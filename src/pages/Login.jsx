import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

export default function SignupDebugger() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/debug/signup-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role: 'user' }),
      });

      const data = await response.json();
      setResult(data);
      
    } catch (error) {
      setResult({
        success: false,
        error: `Network error: ${error.message}`
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Signup Debugger</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Direct Signup</CardTitle>
            <CardDescription>
              Bypass the regular auth flow to test MongoDB directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={testSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Testing...' : 'Test Signup'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Alert variant={result.success ? 'default' : 'destructive'} className="mb-6">
            <Terminal className="h-4 w-4" />
            <AlertDescription>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Current Users</CardTitle>
            <CardDescription>
              Check what users exist in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={async () => {
                const response = await fetch('http://localhost:5000/api/debug/users');
                const data = await response.json();
                setResult(data);
              }}
              variant="outline"
              className="w-full"
            >
              Refresh Users List
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}