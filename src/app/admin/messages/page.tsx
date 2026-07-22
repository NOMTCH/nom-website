'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ContactMessage, getContactMessages, markMessageAsRead, deleteMessage } from '@/lib/data/messages';
import { toast } from 'sonner';
import { Envelope, EnvelopeOpen, Trash, SpinnerGap } from '@phosphor-icons/react';
import Portal from '@/components/Portal';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const router = useRouter();

  const fetchMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengambil pesan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        fetchMessages();
      }
    };
    checkAuth();
  }, [router]);

  const handleMarkAsRead = async (id: string, currentStatus: string) => {
    if (currentStatus === 'read') return;
    try {
      await markMessageAsRead(id);
      setMessages(messages.map(msg => msg.id === id ? { ...msg, status: 'read' } : msg));
    } catch (error) {
      toast.error('Gagal update status pesan');
    }
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;
    try {
      await deleteMessage(messageToDelete);
      toast.success('Pesan berhasil dihapus!');
      setMessages(messages.filter(msg => msg.id !== messageToDelete));
    } catch (error) {
      toast.error('Gagal menghapus pesan');
    } finally {
      setMessageToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 md:p-12 flex items-center justify-center">
        <div className="w-12 h-12 border border-border rounded-2xl border-t-accent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-foreground uppercase tracking-tight">
              Inbox Pesan
            </h1>
            <p className="text-muted mt-2">Baca semua pesan dari calon klien (Website Contact Form).</p>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-3xl flex flex-col items-center justify-center min-h-[400px] bg-surface/50">
            <p className="text-xl font-bold uppercase text-foreground mb-2">NO MESSAGES INBOX</p>
            <p className="font-semibold text-sm text-muted">All incoming messages from the contact form will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => handleMarkAsRead(msg.id, msg.status)}
                className={`
                  bg-surface border rounded-2xl p-6 md:p-8 relative flex flex-col md:flex-row gap-6 items-start transition-all cursor-pointer group shadow-md
                  ${msg.status === 'unread' ? 'border-accent/50 bg-accent/5 shadow-accent/5' : 'border-border opacity-90 hover:opacity-100'}
                `}
              >
                {msg.status === 'unread' && (
                  <div className="absolute -top-3 right-4 bg-accent text-white font-bold text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-lg shadow-sm">
                    NEW
                  </div>
                )}
                
                <div className="shrink-0 pt-1">
                  {msg.status === 'unread' ? (
                    <Envelope weight="fill" size={32} className="text-accent" />
                  ) : (
                    <EnvelopeOpen weight="bold" size={32} className="text-muted" />
                  )}
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-display font-black text-2xl uppercase tracking-tight text-foreground">{msg.name}</h3>
                      <a href={`mailto:${msg.email}`} onClick={e => e.stopPropagation()} className="font-bold text-accent hover:underline">{msg.email}</a>
                    </div>
                    <div className="text-sm font-semibold text-muted uppercase tracking-widest">
                      {new Date(msg.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="bg-background border border-border p-4 rounded-xl font-mono text-sm text-foreground whitespace-pre-wrap mt-4">
                    {msg.project_details}
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-start mt-4 md:mt-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMessageToDelete(msg.id);
                    }} 
                    className="p-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20 rounded-xl transition-all"
                    title="Delete Message"
                  >
                    <Trash weight="bold" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        {messageToDelete && (
          <Portal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setMessageToDelete(null)} style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div className="bg-surface border border-border shadow-2xl rounded-3xl w-full max-w-md my-8 p-6 relative overflow-hidden text-foreground animate-scale-in" onClick={e => e.stopPropagation()}>
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 mx-auto rounded-2xl flex items-center justify-center mb-6">
                    <Trash weight="fill" size={32} />
                  </div>
                  <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-2 text-foreground">Delete Message?</h2>
                  <p className="font-semibold text-muted mb-8 text-sm">Are you sure you want to delete this message? This action cannot be undone.</p>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setMessageToDelete(null)}
                      className="flex-1 py-3.5 bg-background border border-border rounded-xl font-bold uppercase text-xs tracking-wider text-muted hover:text-foreground transition-all shadow-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmDelete}
                      className="flex-1 py-3.5 bg-red-500 text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Portal>
        )}
      </div>
    </div>
  );
}
