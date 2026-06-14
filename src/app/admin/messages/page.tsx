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
        <div className="w-12 h-12 border-4 border-foreground border-t-accent rounded-full animate-spin"></div>
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
          <div className="p-12 text-center border-4 border-dashed border-foreground flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-2xl font-black uppercase text-foreground mb-4">BELUM ADA PESAN MASUK</p>
            <p className="font-bold text-muted">Santai dulu kang, ngopi weh bari nungguan aya nu ngechat.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => handleMarkAsRead(msg.id, msg.status)}
                className={`
                  bg-surface border-4 border-foreground p-6 md:p-8 relative flex flex-col md:flex-row gap-6 items-start transition-all cursor-pointer group
                  ${msg.status === 'unread' ? 'shadow-[8px_8px_0_0_#F7DF1E] bg-yellow-50/50' : 'shadow-[8px_8px_0_0_#0F0F0F] opacity-70 hover:opacity-100'}
                `}
              >
                {msg.status === 'unread' && (
                  <div className="absolute -top-4 -right-4 bg-accent text-black font-black text-xs uppercase tracking-widest px-4 py-2 border-4 border-foreground shadow-[4px_4px_0_0_#0F0F0F] transform rotate-3">
                    NEW!
                  </div>
                )}
                
                <div className="shrink-0 pt-1">
                  {msg.status === 'unread' ? (
                    <Envelope weight="fill" size={32} className="text-accent drop-shadow-[2px_2px_0_rgba(0,0,0,1)]" />
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
                  
                  <div className="bg-white border-2 border-gray-200 p-4 font-mono text-sm text-gray-800 whitespace-pre-wrap mt-4">
                    {msg.project_details}
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-start mt-4 md:mt-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMessageToDelete(msg.id);
                    }} 
                    className="p-3 bg-red-50 hover:bg-red-500 hover:text-white transition-colors border-2 border-transparent hover:border-black text-red-500"
                    title="Hapus Pesan"
                  >
                    <Trash weight="bold" size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Brutal Delete Modal (Sunda Pride) */}
        {messageToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setMessageToDelete(null)}>
            <div className="bg-surface border-8 border-foreground shadow-[16px_16px_0_0_#FF6138] w-full max-w-md my-8 relative overflow-hidden animate-[bounce_0.3s_ease-in-out]" onClick={e => e.stopPropagation()}>
              <div className="absolute top-0 left-0 right-0 h-4 bg-[repeating-linear-gradient(45deg,#0F0F0F,#0F0F0F_10px,#F7DF1E_10px,#F7DF1E_20px)] border-b-4 border-foreground" />
              
              <div className="p-8 pt-12 text-center">
                <div className="w-20 h-20 bg-red-500 mx-auto border-4 border-foreground shadow-[8px_8px_0_0_#0F0F0F] flex items-center justify-center mb-6">
                  <Trash weight="fill" size={40} className="text-white" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">HAPUS PESAN IEU?</h2>
                <p className="font-bold text-gray-600 mb-8 uppercase text-sm">Asli yeuh rek dihapus pesanna? Bisi aya nu penting tina klien.</p>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setMessageToDelete(null)}
                    className="flex-1 py-4 bg-white border-4 border-foreground font-black uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-[4px_4px_0_0_#0F0F0F] active:translate-y-1 active:shadow-[0_0_0_0_#0F0F0F]"
                  >
                    TEU JADI
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 py-4 bg-red-500 text-white border-4 border-foreground font-black uppercase tracking-widest shadow-[4px_4px_0_0_#0F0F0F] hover:bg-red-600 active:translate-y-1 active:shadow-[0_0_0_0_#0F0F0F] transition-all"
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
