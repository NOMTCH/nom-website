'use client';

import { useCVStore } from '@/store/cvStore';
import { motion } from 'framer-motion';
import { Plus, Trash, LockKey } from '@phosphor-icons/react';

export function Sidebar() {
  const store = useCVStore();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      store.updateField('photoUrl', url);
    }
  };

  return (
    <aside className="w-full md:w-[320px] lg:w-[380px] h-1/2 md:h-full border-b-4 md:border-b-0 md:border-r-4 border-foreground bg-[#F0F0F0] overflow-y-auto flex flex-col z-40 custom-scrollbar shadow-[0_4px_0_0_#0F0F0F] md:shadow-[4px_0_0_0_#0F0F0F]">
      <div className="p-4 md:p-6 flex flex-col gap-6 md:gap-8">
        
        {/* Template Selector */}
        <div className="space-y-3">
          <label className="text-sm font-black text-black uppercase tracking-wider bg-white px-2 border-2 border-foreground inline-block shadow-[2px_2px_0_0_#0F0F0F]">Select Template</label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[1, 2, 3, 4].map((id) => (
              <button
                key={id}
                onClick={() => store.setTemplateId(id)}
                className={`py-3 px-4 border-2 font-black uppercase transition-all shadow-[4px_4px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F]
                  ${store.templateId === id 
                    ? 'bg-[#F7DF1E] border-foreground text-black' 
                    : 'bg-white border-foreground text-gray-500 hover:text-black'
                  }`}
              >
                TPL {id}
              </button>
            ))}
          </div>
        </div>

        <div className="h-1 bg-foreground w-full" />

        {/* Basic Info */}
        <div className="space-y-4">
          <label className="text-sm font-black text-black uppercase tracking-wider bg-white px-2 border-2 border-foreground inline-block shadow-[2px_2px_0_0_#0F0F0F]">Basic Info</label>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-black uppercase block">Photo Style</label>
            <div className="grid grid-cols-4 gap-2">
              {(['square', 'circle', 'arch', 'polygon'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => store.setPhotoStyle(style)}
                  className={`py-1.5 px-2 border-2 border-foreground font-black text-[9px] uppercase transition-all
                    ${store.photoStyle === style ? 'bg-[#F7DF1E] shadow-[2px_2px_0_0_#0F0F0F]' : 'bg-white shadow-[1px_1px_0_0_#0F0F0F] text-gray-500'}
                  `}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-black uppercase">Profile Photo</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:border-2 file:border-foreground file:bg-[#F7DF1E] file:text-xs file:font-black file:uppercase hover:file:bg-black hover:file:text-white transition-colors cursor-pointer bg-white border-2 border-foreground shadow-[2px_2px_0_0_#0F0F0F]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-black uppercase">Full Name</label>
            <input 
              type="text" 
              value={store.fullName}
              onChange={(e) => store.updateField('fullName', e.target.value)}
              className="w-full bg-white border-2 border-foreground px-4 py-3 text-sm font-bold focus:bg-[#F7DF1E] outline-none transition-colors shadow-[4px_4px_0_0_#0F0F0F]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-black uppercase">Role / Profession</label>
            <input 
              type="text" 
              value={store.role}
              onChange={(e) => store.updateField('role', e.target.value)}
              className="w-full bg-white border-2 border-foreground px-4 py-3 text-sm font-bold focus:bg-[#F7DF1E] outline-none transition-colors shadow-[4px_4px_0_0_#0F0F0F]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-black uppercase">Professional Summary</label>
            <textarea 
              value={store.summary}
              onChange={(e) => store.updateField('summary', e.target.value)}
              className="w-full bg-white border-2 border-foreground px-4 py-3 text-sm font-bold focus:bg-[#F7DF1E] outline-none transition-colors shadow-[4px_4px_0_0_#0F0F0F] h-28 resize-none custom-scrollbar"
            />
          </div>
        </div>

        <div className="h-1 bg-foreground w-full" />

        {/* Custom Labels Section */}
        <div className="space-y-4">
          <label className="text-sm font-black text-black uppercase tracking-wider bg-white px-2 border-2 border-foreground inline-block shadow-[2px_2px_0_0_#0F0F0F]">Labels Translation</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(store.labels).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase">{key}</label>
                <input 
                  type="text" 
                  value={value}
                  onChange={(e) => store.updateLabel(key as keyof typeof store.labels, e.target.value)}
                  className="w-full bg-white border-2 border-foreground px-2 py-1.5 text-xs font-bold focus:bg-[#F7DF1E] outline-none transition-colors shadow-[2px_2px_0_0_#0F0F0F]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="h-1 bg-foreground w-full" />

        {/* Experience Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-black text-black uppercase tracking-wider bg-white px-2 border-2 border-foreground inline-block shadow-[2px_2px_0_0_#0F0F0F]">Experience</label>
            <button 
              onClick={store.addExperience}
              className="w-8 h-8 bg-accent border-2 border-foreground text-white flex items-center justify-center hover:-translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] shadow-[4px_4px_0_0_#0F0F0F] transition-all"
            >
              <Plus weight="bold" />
            </button>
          </div>
          
          <div className="space-y-6">
            {store.experiences.map((exp, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={exp.id} 
                className="p-4 bg-white border-4 border-foreground shadow-[8px_8px_0_0_#0F0F0F] space-y-3 relative group"
              >
                <button 
                  onClick={() => store.removeExperience(exp.id)}
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 border-2 border-foreground text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:scale-110 shadow-[2px_2px_0_0_#0F0F0F]"
                >
                  <Trash weight="bold" />
                </button>
                <div className="text-sm font-black bg-black text-white px-2 py-1 inline-block -mt-8 -ml-4 border-r-2 border-b-2 border-foreground">#{idx + 1}</div>
                <input 
                  type="text" 
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => store.updateExperience(exp.id, 'title', e.target.value)}
                  className="w-full bg-[#F0F0F0] border-2 border-foreground px-3 py-2 text-sm font-bold focus:bg-white outline-none transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="Company & Duration"
                  value={exp.companyDuration}
                  onChange={(e) => store.updateExperience(exp.id, 'companyDuration', e.target.value)}
                  className="w-full bg-[#F0F0F0] border-2 border-foreground px-3 py-2 text-sm font-bold focus:bg-white outline-none transition-colors"
                />
                <textarea 
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => store.updateExperience(exp.id, 'description', e.target.value)}
                  className="w-full bg-[#F0F0F0] border-2 border-foreground px-3 py-2 text-sm font-bold focus:bg-white outline-none transition-colors h-20 resize-none custom-scrollbar"
                />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
}
