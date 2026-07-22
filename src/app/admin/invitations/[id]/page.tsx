'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FloppyDisk, Trash, Users, Info, Heart, Calendar, Gift, TShirt, VideoCamera, ChatCenteredText } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { getInvitationById, updateInvitation, getRSVPsByInvitationId, deleteRSVP, Invitation, RSVPResponse } from '@/lib/data/invitations';

export default function EditInvitationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'rsvps'>('details');

  // Form states
  const [groomName, setGroomName] = useState('');
  const [groomFullName, setGroomFullName] = useState('');
  const [groomParents, setGroomParents] = useState('');
  const [groomPhoto, setGroomPhoto] = useState('');

  const [brideName, setBrideName] = useState('');
  const [brideFullName, setBrideFullName] = useState('');
  const [brideParents, setBrideParents] = useState('');
  const [bridePhoto, setBridePhoto] = useState('');

  const [weddingDate, setWeddingDate] = useState('');
  
  const [ceremonyTime, setCeremonyTime] = useState('');
  const [ceremonyLocation, setCeremonyLocation] = useState('');
  const [ceremonyAddress, setCeremonyAddress] = useState('');
  const [ceremonyMapUrl, setCeremonyMapUrl] = useState('');

  const [receptionTime, setReceptionTime] = useState('');
  const [receptionLocation, setReceptionLocation] = useState('');
  const [receptionAddress, setReceptionAddress] = useState('');
  const [receptionMapUrl, setReceptionMapUrl] = useState('');

  const [quote, setQuote] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  
  // Premium states
  const [gift1Type, setGift1Type] = useState<'bank' | 'qris'>('bank');
  const [gift1Bank, setGift1Bank] = useState('');
  const [gift1Name, setGift1Name] = useState('');
  const [gift1No, setGift1No] = useState('');
  
  const [gift2Type, setGift2Type] = useState<'bank' | 'qris'>('qris');
  const [gift2Bank, setGift2Bank] = useState('');
  const [gift2Name, setGift2Name] = useState('');
  const [gift2No, setGift2No] = useState('');
  const [gift2QrisImg, setGift2QrisImg] = useState('');

  const [dressColors, setDressColors] = useState('');
  const [dressDesc, setDressDesc] = useState('');

  const [streamPlatform, setStreamPlatform] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [streamTime, setStreamTime] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const invData = await getInvitationById(id);
        if (invData) {
          setInvitation(invData);
          
          // Populate basic details
          setGroomName(invData.data.groom?.name || '');
          setGroomFullName(invData.data.groom?.fullName || '');
          setGroomParents(invData.data.groom?.parents || '');
          setGroomPhoto(invData.data.groom?.photo || '');

          setBrideName(invData.data.bride?.name || '');
          setBrideFullName(invData.data.bride?.fullName || '');
          setBrideParents(invData.data.bride?.parents || '');
          setBridePhoto(invData.data.bride?.photo || '');

          setWeddingDate(invData.data.date || '');
          
          setCeremonyTime(invData.data.ceremony?.time || '');
          setCeremonyLocation(invData.data.ceremony?.location || '');
          setCeremonyAddress(invData.data.ceremony?.address || '');
          setCeremonyMapUrl(invData.data.ceremony?.mapUrl || '');

          setReceptionTime(invData.data.reception?.time || '');
          setReceptionLocation(invData.data.reception?.location || '');
          setReceptionAddress(invData.data.reception?.address || '');
          setReceptionMapUrl(invData.data.reception?.mapUrl || '');

          setQuote(invData.data.quote || '');
          setMusicUrl(invData.data.musicUrl || '');

          // Populate gifts
          const gifts = invData.data.gifts || [];
          if (gifts[0]) {
            setGift1Type(gifts[0].type || 'bank');
            setGift1Bank(gifts[0].bankName || '');
            setGift1Name(gifts[0].accountName || '');
            setGift1No(gifts[0].accountNo || '');
          }
          if (gifts[1]) {
            setGift2Type(gifts[1].type || 'qris');
            setGift2Bank(gifts[1].bankName || '');
            setGift2Name(gifts[1].accountName || '');
            setGift2No(gifts[1].accountNo || '');
            setGift2QrisImg(gifts[1].qrisImg || '');
          }

          // Dress code
          setDressColors(invData.data.dressCode?.colors?.join(', ') || '');
          setDressDesc(invData.data.dressCode?.description || '');

          // Live stream
          setStreamPlatform(invData.data.liveStream?.platform || '');
          setStreamUrl(invData.data.liveStream?.url || '');
          setStreamTime(invData.data.liveStream?.time || '');

          // Load RSVPs
          const rsvpData = await getRSVPsByInvitationId(invData.id);
          setRsvps(rsvpData);
        } else {
          toast.error('Undangan tidak ditemukan');
          router.push('/admin/invitations');
        }
      } catch (err) {
        toast.error('Gagal memuat data undangan');
      } finally {
        setFetchingData(false);
      }
    }
    loadData();
  }, [id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!invitation) return;

      const colorsArray = dressColors
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      const updatedData = {
        ...invitation.data,
        groom: { name: groomName, fullName: groomFullName, parents: groomParents, photo: groomPhoto },
        bride: { name: brideName, fullName: brideFullName, parents: brideParents, photo: bridePhoto },
        date: weddingDate,
        ceremony: { time: ceremonyTime, location: ceremonyLocation, address: ceremonyAddress, mapUrl: ceremonyMapUrl },
        reception: { time: receptionTime, location: receptionLocation, address: receptionAddress, mapUrl: receptionMapUrl },
        quote,
        musicUrl,
        gifts: [
          { type: gift1Type, bankName: gift1Bank, accountName: gift1Name, accountNo: gift1No },
          { type: gift2Type, bankName: gift2Bank, accountName: gift2Name, accountNo: gift2No, qrisImg: gift2QrisImg }
        ],
        dressCode: { colors: colorsArray, description: dressDesc },
        liveStream: { platform: streamPlatform, url: streamUrl, time: streamTime }
      };

      await updateInvitation(id, { data: updatedData });
      toast.success('Undangan berhasil disimpan!');
      
      // Update local invitation state
      setInvitation({ ...invitation, data: updatedData });
    } catch (err) {
      toast.error('Gagal menyimpan undangan');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRsvp = async (rsvpId: string) => {
    if (!confirm('Hapus ucapan ini?')) return;
    try {
      await deleteRSVP(rsvpId);
      toast.success('RSVP berhasil dihapus');
      setRsvps(rsvps.filter(r => r.id !== rsvpId));
    } catch (e) {
      toast.error('Gagal menghapus RSVP');
    }
  };

  if (fetchingData) {
    return (
      <div className="flex-1 p-8 md:p-12 flex items-center justify-center">
        <div className="w-12 h-12 border border-border rounded-2xl border-t-accent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/admin/invitations" 
          className="inline-flex items-center gap-2 mb-6 font-bold uppercase text-xs tracking-wider border border-border rounded-xl bg-surface text-foreground px-4 py-2.5 hover:bg-background transition-all shadow-sm"
        >
          <ArrowLeft weight="bold" /> Kembali ke Daftar
        </Link>

        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight">
              Edit: {groomName} & {brideName}
            </h1>
            <p className="text-xs font-bold text-muted uppercase mt-1">
              Link Undangan: <a href={`/inv/${invitation?.slug}`} target="_blank" className="text-blue-600 underline">/inv/{invitation?.slug}</a>
            </p>
          </div>
          <span className={`px-4 py-2 border border-border rounded-xl font-bold text-xs uppercase tracking-wider ${
            invitation?.status === 'published' ? 'bg-emerald-500 text-white' : 
            invitation?.status === 'draft' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {invitation?.status}
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 mb-8 gap-2">
          <button 
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-bold uppercase text-xs tracking-wider border-b-2 transition-all ${
              activeTab === 'details' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Form Undangan
          </button>
          <button 
            onClick={() => setActiveTab('rsvps')}
            className={`px-6 py-3 font-bold uppercase text-xs tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'rsvps' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users weight="bold" size={16} /> RSVP & Ucapan ({rsvps.length})
          </button>
        </div>

        {/* Tab Content 1: Invitation Details Form */}
        {activeTab === 'details' && (
          <form onSubmit={handleSave} className="space-y-8 bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm">
            
            {/* 1. Bride & Groom Info */}
            <div>
              <h2 className="text-xl font-display font-black uppercase tracking-tight mb-6 flex items-center gap-2 border-b border-gray-100 pb-2 text-red-500">
                <Heart weight="bold" /> Data Mempelai
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Groom Form */}
                <div className="space-y-4 p-6 border border-border bg-background rounded-2xl">
                  <h3 className="font-black text-sm uppercase tracking-wide text-muted mb-2">Mempelai Pria (Groom)</h3>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1 text-muted">Nama Panggilan</label>
                    <input type="text" value={groomName} onChange={(e) => setGroomName(e.target.value)} className="w-full p-2.5 bg-surface border border-border text-foreground rounded-xl text-sm font-bold focus:outline-none focus:border-accent" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1 text-muted">Nama Lengkap</label>
                    <input type="text" value={groomFullName} onChange={(e) => setGroomFullName(e.target.value)} className="w-full p-2.5 bg-surface border border-border text-foreground rounded-xl text-sm font-bold focus:outline-none focus:border-accent" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1 text-muted">Nama Orang Tua</label>
                    <input type="text" value={groomParents} onChange={(e) => setGroomParents(e.target.value)} className="w-full p-2.5 bg-surface border border-border text-foreground rounded-xl text-sm font-bold focus:outline-none focus:border-accent" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1 text-muted">Foto Mempelai Pria (URL)</label>
                    <input type="text" value={groomPhoto} onChange={(e) => setGroomPhoto(e.target.value)} className="w-full p-2.5 bg-surface border border-border text-foreground rounded-xl text-xs font-mono focus:outline-none focus:border-accent" />
                  </div>
                </div>

                {/* Bride Form */}
                <div className="space-y-4 p-6 border border-border bg-background rounded-2xl">
                  <h3 className="font-black text-sm uppercase tracking-wide text-muted mb-2">Mempelai Wanita (Bride)</h3>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1 text-muted">Nama Panggilan</label>
                    <input type="text" value={brideName} onChange={(e) => setBrideName(e.target.value)} className="w-full p-2.5 bg-surface border border-border text-foreground rounded-xl text-sm font-bold focus:outline-none focus:border-accent" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1 text-muted">Nama Lengkap</label>
                    <input type="text" value={brideFullName} onChange={(e) => setBrideFullName(e.target.value)} className="w-full p-2.5 bg-surface border border-border text-foreground rounded-xl text-sm font-bold focus:outline-none focus:border-accent" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1 text-muted">Nama Orang Tua</label>
                    <input type="text" value={brideParents} onChange={(e) => setBrideParents(e.target.value)} className="w-full p-2.5 bg-surface border border-border text-foreground rounded-xl text-sm font-bold focus:outline-none focus:border-accent" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1 text-muted">Foto Mempelai Wanita (URL)</label>
                    <input type="text" value={bridePhoto} onChange={(e) => setBridePhoto(e.target.value)} className="w-full p-2.5 bg-surface border border-border text-foreground rounded-xl text-xs font-mono focus:outline-none focus:border-accent" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Event Date & Quotes */}
            <div>
              <h2 className="text-xl font-display font-black uppercase tracking-tight mb-6 flex items-center gap-2 border-b border-border pb-2 text-amber-500">
                <Calendar weight="bold" /> Waktu & Kutipan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Tanggal Pernikahan (Teks)</label>
                  <input type="text" value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} placeholder="Sabtu, 20 Desember 2026" className="w-full p-3 border border-border rounded-xl text-sm font-bold focus:outline-none" required />
                  <span className="text-[10px] text-gray-500 font-bold uppercase mt-1 block">Contoh: Sabtu, 20 Desember 2026</span>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Musik Latar (MP3 URL)</label>
                  <input type="text" value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} placeholder="/assets/music/wedding-day.mp3" className="w-full p-3 border border-border rounded-xl text-xs font-mono focus:outline-none" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-black uppercase mb-1">Kutipan / Quote Nikah</label>
                <textarea rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} className="w-full p-3 border border-border rounded-xl text-sm font-bold focus:outline-none" />
              </div>
            </div>

            {/* 3. Ceremony & Reception */}
            <div>
              <h2 className="text-xl font-display font-black uppercase tracking-tight mb-6 flex items-center gap-2 border-b border-border pb-2 text-cyan-500">
                <Info weight="bold" /> Detail Acara
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Akad Nikah */}
                <div className="space-y-4 p-6 border border-border bg-white rounded-2xl">
                  <h3 className="font-black text-sm uppercase tracking-wide text-gray-500 mb-2">Akad Nikah / Ceremony</h3>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Waktu Akad</label>
                    <input type="text" value={ceremonyTime} onChange={(e) => setCeremonyTime(e.target.value)} placeholder="09:00 - 10:00 WIB" className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Nama Tempat</label>
                    <input type="text" value={ceremonyLocation} onChange={(e) => setCeremonyLocation(e.target.value)} placeholder="Masjid Agung" className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Alamat Tempat</label>
                    <input type="text" value={ceremonyAddress} onChange={(e) => setCeremonyAddress(e.target.value)} placeholder="Jl. Soekarno Hatta No. 1" className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Link Google Map</label>
                    <input type="text" value={ceremonyMapUrl} onChange={(e) => setCeremonyMapUrl(e.target.value)} className="w-full p-2 border border-border rounded-xl text-xs font-mono focus:outline-none" />
                  </div>
                </div>

                {/* Resepsi */}
                <div className="space-y-4 p-6 border border-border bg-white rounded-2xl">
                  <h3 className="font-black text-sm uppercase tracking-wide text-gray-500 mb-2">Resepsi / Reception</h3>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Waktu Resepsi</label>
                    <input type="text" value={receptionTime} onChange={(e) => setReceptionTime(e.target.value)} placeholder="18:00 - Selesai" className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Nama Tempat</label>
                    <input type="text" value={receptionLocation} onChange={(e) => setReceptionLocation(e.target.value)} placeholder="Grand Ballroom" className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Alamat Tempat</label>
                    <input type="text" value={receptionAddress} onChange={(e) => setReceptionAddress(e.target.value)} placeholder="Jl. Merdeka No. 2" className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Link Google Map</label>
                    <input type="text" value={receptionMapUrl} onChange={(e) => setReceptionMapUrl(e.target.value)} className="w-full p-2 border border-border rounded-xl text-xs font-mono focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Premium: Gifts & Angpao */}
            <div>
              <h2 className="text-xl font-display font-black uppercase tracking-tight mb-6 flex items-center gap-2 border-b border-border pb-2 text-emerald-500">
                <Gift weight="bold" /> Kado Digital / Angpao (Premium)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gift 1 */}
                <div className="space-y-4 p-6 border border-border bg-white rounded-2xl">
                  <h3 className="font-black text-sm uppercase tracking-wide text-gray-500 mb-2">Kado 1 (Umumnya Rekening Bank)</h3>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Jenis Kado</label>
                    <select value={gift1Type} onChange={(e) => setGift1Type(e.target.value as 'bank' | 'qris')} className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none">
                      <option value="bank">Bank / Transfer</option>
                      <option value="qris">QRIS Code</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Nama Bank / Platform</label>
                    <input type="text" value={gift1Bank} onChange={(e) => setGift1Bank(e.target.value)} placeholder="BCA, Mandiri, dll." className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Atas Nama Pemilik</label>
                    <input type="text" value={gift1Name} onChange={(e) => setGift1Name(e.target.value)} className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Nomor Rekening</label>
                    <input type="text" value={gift1No} onChange={(e) => setGift1No(e.target.value)} className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" />
                  </div>
                </div>

                {/* Gift 2 */}
                <div className="space-y-4 p-6 border border-border bg-white rounded-2xl">
                  <h3 className="font-black text-sm uppercase tracking-wide text-gray-500 mb-2">Kado 2 (Umumnya QRIS atau Bank Lain)</h3>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Jenis Kado</label>
                    <select value={gift2Type} onChange={(e) => setGift2Type(e.target.value as 'bank' | 'qris')} className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none">
                      <option value="bank">Bank / Transfer</option>
                      <option value="qris">QRIS Code</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Nama Bank / Platform</label>
                    <input type="text" value={gift2Bank} onChange={(e) => setGift2Bank(e.target.value)} placeholder="QRIS, BNI, GoPay, dll." className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Atas Nama Pemilik / Merchant</label>
                    <input type="text" value={gift2Name} onChange={(e) => setGift2Name(e.target.value)} className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" />
                  </div>
                  {gift2Type === 'bank' ? (
                    <div>
                      <label className="block text-[10px] font-black uppercase mb-1">Nomor Rekening</label>
                      <input type="text" value={gift2No} onChange={(e) => setGift2No(e.target.value)} className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-black uppercase mb-1">Gambar QRIS (URL)</label>
                      <input type="text" value={gift2QrisImg} onChange={(e) => setGift2QrisImg(e.target.value)} placeholder="https://..." className="w-full p-2 border border-border rounded-xl text-xs font-mono focus:outline-none" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 5. Dress Code & Live Stream */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dress Code */}
              <div className="space-y-4 p-6 border border-border bg-white rounded-2xl">
                <h2 className="text-base font-display font-black uppercase tracking-tight mb-2 flex items-center gap-2 border-b border-border pb-1 text-purple-500">
                  <TShirt weight="bold" /> Dress Code (Premium)
                </h2>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Pilihan Warna (Hex Code, pisah dengan koma)</label>
                  <input type="text" value={dressColors} onChange={(e) => setDressColors(e.target.value)} placeholder="#D4AF37, #8B7355, #FAFAFA, #2C2C2C" className="w-full p-2 border border-border rounded-xl text-xs font-mono focus:outline-none" />
                  <span className="text-[9px] text-gray-500 font-bold uppercase mt-1 block">Contoh: #D4AF37, #8B7355, #FFFFFF</span>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Panduan / Deskripsi Pakaian</label>
                  <textarea rows={2} value={dressDesc} onChange={(e) => setDressDesc(e.target.value)} placeholder="Harap memakai pakaian dengan warna senada..." className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" />
                </div>
              </div>

              {/* Live Stream */}
              <div className="space-y-4 p-6 border border-border bg-white rounded-2xl">
                <h2 className="text-base font-display font-black uppercase tracking-tight mb-2 flex items-center gap-2 border-b border-border pb-1 text-red-500">
                  <VideoCamera weight="bold" /> Live Stream (Premium)
                </h2>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Platform Live</label>
                  <input type="text" value={streamPlatform} onChange={(e) => setStreamPlatform(e.target.value)} placeholder="YouTube / Zoom" className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Link Live Streaming URL</label>
                  <input type="text" value={streamUrl} onChange={(e) => setStreamUrl(e.target.value)} placeholder="https://youtube.com/..." className="w-full p-2 border border-border rounded-xl text-xs font-mono focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Keterangan Waktu Live</label>
                  <input type="text" value={streamTime} onChange={(e) => setStreamTime(e.target.value)} placeholder="Akad Nikah - 09:00 WIB" className="w-full p-2 border border-border rounded-xl text-sm font-bold focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-border flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="bg-accent text-white hover:bg-accent/90 font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-sm disabled:opacity-50 text-xs"
              >
                <FloppyDisk weight="bold" size={18} />
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

          </form>
        )}

        {/* Tab Content 2: RSVPs & Wishes List */}
        {activeTab === 'rsvps' && (
          <div className="space-y-6 bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h2 className="text-xl font-display font-black uppercase tracking-tight flex items-center gap-2">
                <ChatCenteredText weight="bold" /> Daftar Kehadiran & Ucapan Tamu
              </h2>
              <span className="bg-slate-900 text-white px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm">
                Total: {rsvps.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background text-muted font-semibold uppercase tracking-widest text-[11px] border-b border-border">
                    <th className="p-3">Nama Tamu</th>
                    <th className="p-3">Kehadiran</th>
                    <th className="p-3">Ucapan / Wishes</th>
                    <th className="p-3">Waktu Kirim</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-muted font-bold text-sm uppercase tracking-widest bg-surface">
                        Belum ada RSVP atau ucapan dari tamu.
                      </td>
                    </tr>
                  ) : (
                    rsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="border-b border-border/40 bg-surface hover:bg-background/50 transition-colors">
                        <td className="p-3 font-bold text-sm truncate max-w-[150px] text-foreground">{rsvp.name}</td>
                        <td className="p-3 text-xs">
                          <span className={`px-2 py-1 font-bold uppercase text-[9px] rounded-lg tracking-wider ${
                            rsvp.attendance === 'hadir' ? 'bg-accent text-white' : 'bg-red-500 text-white'
                          }`}>
                            {rsvp.attendance}
                          </span>
                        </td>
                        <td className="p-3 text-sm max-w-[300px] break-words italic text-foreground">
                          {rsvp.wish || <span className="text-muted font-normal">Tidak mengirim ucapan</span>}
                        </td>
                        <td className="p-3 text-[10px] font-bold text-muted uppercase whitespace-nowrap">
                          {new Date(rsvp.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} {new Date(rsvp.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => handleDeleteRsvp(rsvp.id)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all rounded-lg border border-red-500/20"
                            title="Hapus Ucapan"
                          >
                            <Trash weight="bold" size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
