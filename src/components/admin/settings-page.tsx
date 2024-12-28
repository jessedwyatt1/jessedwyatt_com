"use client"

import React, { useState } from 'react';
import { AlertCircle, Lock, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isLoggedIn } = useAuth();

  const regenerateEmbeddings = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'regenerate'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to regenerate embeddings');
      }

      setSuccess('Embeddings regenerated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container max-w-2xl py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You must be logged in to access this page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Admin Settings</h1>
          <p className="text-muted-foreground">
            Manage embeddings and other administrative tasks.
          </p>
        </div>

        {/* Embeddings Management */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Embeddings Management</h2>
          
          <Button
            onClick={regenerateEmbeddings}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Regenerate Embeddings
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-8 flex items-start gap-2 text-sm text-muted-foreground">
          <Lock className="w-4 h-4 mt-0.5" />
          <p>
            This page is protected by authentication. Please ensure you maintain secure login credentials.
          </p>
        </div>
      </div>
    </div>
  );
}