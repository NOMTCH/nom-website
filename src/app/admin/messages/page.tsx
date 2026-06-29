'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ContactMessage, getContactMessages, markMessageAsRead, deleteMessage } from '@/lib/data/messages';
import { toast } from 'sonner';
import { Envelope, EnvelopeOpen, Trash, SpinnerGap } from '@phosphor-icons/react';

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
          <div className="p-12 text-center border border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center min-h-[400px] bg-gray-50/50">
            <p className="text-xl font-bold uppercase text-foreground mb-2">BELUM ADA PESAN MASUK</p>
            <p className="font-medium text-sm text-gray-500">Santai dulu kang, ngopi weh bari nungguan aya nu ngechat.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => handleMarkAsRead(msg.id, msg.status)}
                className={`
                  bg-surface border rounded-2xl p-6 md:p-8 relative flex flex-col md:flex-row gap-6 items-start transition-all cursor-pointer group
                  ${msg.status === 'unread' ? 'border-sky-300 bg-sky-50/10 shadow-sm' : 'border-border shadow-sm opacity-80 hover:opacity-100'}
                `}
              >
                {msg.status === 'unread' && (
                  <div className="absolute -top-3 right-4 bg-sky-500 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-sm">
                    NEW
                  </div>
                )}
                
                <div className="shrink-0 pt-1">
                  {msg.status === 'unread' ? (
                    <Envelope weight="fill" size={32} className="text-sky-500" />
                  ) : (
                    <EnvelopeOpen weight="bold" size={32} className="text-gray-400" />
                  )}
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-display font-black text-2xl uppercase tracking-tight">{msg.name}</h3>
                      <a href={`mailto:${msg.email}`} onClick={e => e.stopPropagation()} className="font-bold text-blue-600 hover:underline">{msg.email}</a>
                    </div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                      {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-100 p-4 rounded-xl font-mono text-sm text-gray-700 whitespace-pre-wrap mt-4">
                    {msg.project_details}
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-start mt-4 md:mt-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMessageToDelete(msg.id);
                    }} 
                    className="p-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 border border-transparent rounded-xl transition-all"
                    title="Hapus Pesan"
                  >
                    <Trash weight="bold" size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Brutal Delete Modal (Sunda Pride) */}
        {messageToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setMessageToDelete(null)}>
            <div className="bg-surface border border-gray-100 shadow-2xl rounded-3xl w-full max-w-md my-8 p-6 relative overflow-hidden animate-[bounce_0.3s_ease-in-out]" onClick={e => e.stopPropagation()}>
              
              
              <div className="p-6 text-center">
                <div className="w-20 h-20 bg-red-500 mx-auto border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center mb-6">
                  <Trash weight="fill" size={40} className="text-white" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">HAPUS PESAN IEU?</h2>
                <p className="font-bold text-gray-600 mb-8 uppercase text-sm">Asli yeuh rek dihapus pesanna? Bisi aya nu penting tina klien.</p>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setMessageToDelete(null)}
                    className="flex-1 py-3.5 bg-gray-50 border border-gray-200/80 rounded-xl font-bold uppercase text-xs tracking-wider text-gray-700 hover:bg-gray-100 hover:-translate-y-0.5 transition-all shadow-sm"
                  >
                    TEU JADI
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-red-700 hover:-translate-y-0.5 transition-all"
                  >
                    HAPUS LAH!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
