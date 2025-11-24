'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Power, PowerOff, ChevronLeft, ChevronRight } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
}

export default function WorkflowsCompact() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadWorkflows();
  }, [page, itemsPerPage]);

  async function loadWorkflows() {
    setLoading(true);
    try {
      const response = await fetch(`/api/workflows?page=${page}&limit=${itemsPerPage}`);
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data.workflows || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error loading workflows:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleWorkflow(id: string, currentStatus: string) {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await fetch(`/api/workflows/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setWorkflows(workflows.map(w => 
        w.id === id ? { ...w, status: newStatus as 'active' | 'inactive' } : w
      ));
    } catch (error) {
      console.error('Error toggling workflow:', error);
    }
  }

  async function triggerWorkflow(id: string) {
    try {
      await fetch(`/api/workflows/${id}/trigger`, { method: 'POST' });
      loadWorkflows();
    } catch (error) {
      console.error('Error triggering workflow:', error);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Automatizaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Cargando...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Automatizaciones</CardTitle>
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="text-xs border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={999}>Todas</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="flex items-center justify-between p-2 rounded border hover:bg-accent"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{workflow.name}</span>
                <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'} className="text-xs shrink-0">
                  {workflow.category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{workflow.description}</p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => triggerWorkflow(workflow.id)}
                className="h-7 w-7 p-0"
              >
                <Play className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleWorkflow(workflow.id, workflow.status)}
                className="h-7 w-7 p-0"
              >
                {workflow.status === 'active' ? (
                  <Power className="h-3 w-3 text-green-500" />
                ) : (
                  <PowerOff className="h-3 w-3 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
        ))}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Página {page} de {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
