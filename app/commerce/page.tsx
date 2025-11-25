'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CommercePage() {
  const searchParams = useSearchParams();
  const tenant = searchParams.get('tenant');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Commerce</h1>
          {tenant && (
            <p className="text-muted-foreground">Tenant: {tenant}</p>
          )}
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Shopify Integration</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Gestiona tu tienda Shopify integrada con SmarterOS
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-secondary/50 p-4">
              <h3 className="font-medium mb-2">Productos</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="rounded-lg border bg-secondary/50 p-4">
              <h3 className="font-medium mb-2">Órdenes</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="rounded-lg border bg-secondary/50 p-4">
              <h3 className="font-medium mb-2">Clientes</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-primary/5 border-primary/20 p-4">
          <p className="text-sm">
            Esta funcionalidad está en desarrollo. Pronto podrás gestionar tu tienda desde aquí.
          </p>
        </div>
      </div>
    </div>
  );
}
