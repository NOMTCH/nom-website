import { Metadata } from 'next';
import { getInvoiceById } from '@/lib/data/invoices';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getInvoiceById(resolvedParams.id);
  
  if (!data) return { title: 'Invoice Not Found' };
  
  return {
    title: `NOM Studio - ${data.invoice_number} - ${data.client_name}`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
