import { NextResponse } from 'next/server';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  file_path: string;
}

let templatesCache: { data: WorkflowTemplate[] | null; timestamp: number } = {
  data: null,
  timestamp: 0
};

const CACHE_DURATION = 10 * 60 * 1000;

async function fetchTemplates(): Promise<WorkflowTemplate[]> {
  if (templatesCache.data && Date.now() - templatesCache.timestamp < CACHE_DURATION) {
    return templatesCache.data;
  }

  try {
    // Fetch automation-manifest.json directly from GitHub
    const response = await fetch(
      'https://raw.githubusercontent.com/SmarterCL/n8n-workflows/main/automation-manifest.json',
      {
        headers: {
          'User-Agent': 'SmarterOS-Dashboard'
        },
        next: { revalidate: 600 }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const manifest = await response.json();
    const templates: WorkflowTemplate[] = manifest.workflows.map((workflow: any) => ({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      category: manifest.categories[workflow.category]?.name || workflow.category,
      file_path: workflow.path
    }));

    templatesCache = {
      data: templates,
      timestamp: Date.now()
    };

    return templates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    return getDemoTemplates();
  }
}

async function getWorkflowDescription(downloadUrl: string): Promise<string> {
  try {
    const response = await fetch(downloadUrl);
    if (response.ok) {
      const workflow = await response.json();
      return workflow.meta?.description || workflow.name || 'Workflow de automatización';
    }
  } catch (error) {
    console.error('Error fetching workflow description:', error);
  }
  return 'Workflow de automatización';
}

function formatCategory(dirname: string): string {
  const map: Record<string, string> = {
    'communication': 'Comunicación',
    'data-processing': 'Procesamiento de Datos',
    'e-commerce': 'E-commerce',
    'business': 'Negocios',
    'ai-automation': 'IA y Automatización'
  };
  return map[dirname] || dirname.charAt(0).toUpperCase() + dirname.slice(1);
}

function formatWorkflowName(filename: string): string {
  return filename
    .replace('.json', '')
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getDemoTemplates(): WorkflowTemplate[] {
  return [
    {
      id: '1',
      name: 'WhatsApp Leads a CRM',
      description: 'Captura leads desde WhatsApp y los sincroniza automáticamente con el CRM',
      category: 'Comunicación',
      file_path: 'templates/communication/whatsapp-leads.json'
    },
    {
      id: '2',
      name: 'Confirmaciones de Agenda',
      description: 'Sincroniza citas de Google Calendar y envía confirmaciones automáticas',
      category: 'Calendario',
      file_path: 'templates/communication/calendar-confirmations.json'
    },
    {
      id: '3',
      name: 'Reporte Diario a Sheets',
      description: 'Genera y envía reportes diarios de inventario a Google Sheets',
      category: 'Reportes',
      file_path: 'templates/data-processing/daily-reports.json'
    },
    {
      id: '4',
      name: 'Notificaciones Slack Ventas',
      description: 'Envía alertas a Slack cuando se registra una nueva venta',
      category: 'E-commerce',
      file_path: 'templates/e-commerce/sales-notifications.json'
    },
    {
      id: '5',
      name: 'Email Marketing Automatizado',
      description: 'Campaña de email marketing basada en comportamiento del usuario',
      category: 'Marketing',
      file_path: 'templates/communication/email-marketing.json'
    },
    {
      id: '6',
      name: 'Sync Shopify a Odoo',
      description: 'Sincronización bidireccional de productos entre Shopify y Odoo ERP',
      category: 'E-commerce',
      file_path: 'templates/e-commerce/shopify-odoo-sync.json'
    },
    {
      id: '7',
      name: 'Procesamiento de Facturas PDF',
      description: 'Extrae datos de facturas PDF y los registra en base de datos',
      category: 'Automatización',
      file_path: 'templates/data-processing/pdf-invoices.json'
    },
    {
      id: '8',
      name: 'Bot AI para WhatsApp',
      description: 'Bot con IA que responde consultas frecuentes en WhatsApp',
      category: 'IA',
      file_path: 'templates/ai-automation/whatsapp-ai-bot.json'
    },
    {
      id: '9',
      name: 'Backup Automático Diario',
      description: 'Realiza backup de bases de datos y los sube a la nube',
      category: 'Mantenimiento',
      file_path: 'templates/business/daily-backup.json'
    },
    {
      id: '10',
      name: 'Monitor de Redes Sociales',
      description: 'Monitorea menciones de marca en redes sociales y alerta al equipo',
      category: 'Marketing',
      file_path: 'templates/communication/social-monitor.json'
    }
  ];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const allTemplates = await fetchTemplates();
    
    const workflows = allTemplates.map((template, index) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      executions_today: Math.floor(Math.random() * 100),
      last_execution: getRandomLastExecution(),
      status: 'active' as const,
      n8n_id: 100 + index,
      file_path: template.file_path
    }));

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedWorkflows = workflows.slice(start, end);

    return NextResponse.json({
      workflows: paginatedWorkflows,
      total: workflows.length,
      page,
      limit,
      totalPages: Math.ceil(workflows.length / limit)
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    );
  }
}

function getRandomLastExecution(): string {
  const options = [
    '30 seg',
    '1 min',
    '2 min',
    '5 min',
    '8 min',
    '15 min',
    '22 min',
    '30 min',
    '1 hora',
    '2 horas'
  ];
  return options[Math.floor(Math.random() * options.length)];
}
