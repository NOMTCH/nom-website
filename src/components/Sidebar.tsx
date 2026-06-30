'use client';

import { useCVStore } from '@/store/cvStore';
import { motion } from 'framer-motion';
import { Plus, Trash, LockKey } from '@phosphor-icons/react';

export function Sidebar() {
  const store = useCVStore();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        store.updateField('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <aside className="w-full md:w-[320px] lg:w-[380px] h-auto md:h-full border-b md:border-b-0 md:border-r border-border bg-[#FAFAFA] md:overflow-y-auto flex flex-col z-10 md:custom-scrollbar shadow-sm">
      <div className="p-4 md:p-6 flex flex-col gap-6 md:gap-8">
        
        {/* Template Selector */}
        <div className="mb-10">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider bg-white px-3 py-1 border border-border inline-block rounded-lg shadow-sm">Select Template</label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { id: 1, label: '1. Basic' },
              { id: 2, label: '2. Formal' },
              { id: 3, label: '3. Service' },
              { id: 4, label: '4. Corporate' },
              { id: 5, label: '5. Creative' },
              { id: 6, label: '6. Premium' }
            ].map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => store.setTemplateId(tpl.id)}
                className={`py-3 px-2 text-xs md:text-sm border-2 font-black uppercase transition-all shadow-sm rounded-xl hover:-translate-y-0.5 hover:shadow-none
                  ${store.templateId === tpl.id 
                    ? 'bg-accent text-white border-accent border-foreground text-black' 
                    : 'bg-white border-foreground text-gray-500 hover:text-black'
                  }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-1 bg-foreground w-full" />

        {/* Basic Info */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider bg-white px-3 py-1 border border-border inline-block rounded-lg shadow-sm">Basic Info</label>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-black uppercase block">Photo Style</label>
            <div className="grid grid-cols-4 gap-2">
              {(['square', 'circle', 'arch', 'polygon'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => store.setPhotoStyle(style)}
                  className={`py-1.5 px-2 border border-border rounded-xl font-black text-[9px] uppercase transition-all
                    ${store.photoStyle === style ? 'bg-accent text-white border-accent shadow-none' : 'bg-white shadow-[1px_1px_0_0_#0F0F0F] text-gray-500'}
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
              className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:border-2 file:border-foreground file:bg-accent text-white border-accent file:text-xs file:font-black file:uppercase hover:file:bg-black hover:file:text-white transition-colors cursor-pointer bg-white border rounded-xl shadow-none"
            />
          </div>

          {store.photoUrl && (
            <div className="p-3 border border-border rounded-xl bg-gray-50 space-y-3 shadow-none mt-2">
              <label className="text-[10px] font-bold text-black uppercase border-b border-border pb-1">Photo Adjustments</label>
              
              <div>
                <label className="text-[9px] font-bold text-gray-800 flex justify-between uppercase">
                  <span>Zoom / Scale</span>
                  <span>{Math.round(store.photoZoom * 100)}%</span>
                </label>
                <input 
                  type="range" min="0.5" max="3" step="0.1" 
                  value={store.photoZoom} 
                  onChange={(e) => store.setPhotoAdjustments(parseFloat(e.target.value), store.photoPanX, store.photoPanY)}
                  className="w-full accent-black"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-gray-800 flex justify-between uppercase">
                    <span>X (Kiri-Kanan)</span>
                  </label>
                  <input 
                    type="range" min="0" max="100" 
                    value={store.photoPanX} 
                    onChange={(e) => store.setPhotoAdjustments(store.photoZoom, parseInt(e.target.value), store.photoPanY)}
                    className="w-full accent-black"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] font-bold text-gray-800 flex justify-between uppercase">
                    <span>Y (Atas-Bawah)</span>
                  </label>
                  <input 
                    type="range" min="0" max="100" 
                    value={store.photoPanY} 
                    onChange={(e) => store.setPhotoAdjustments(store.photoZoom, store.photoPanX, parseInt(e.target.value))}
                    className="w-full accent-black"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-black uppercase">Full Name</label>
            <input 
              type="text" 
              value={store.fullName}
              onChange={(e) => store.updateField('fullName', e.target.value)}
              className="w-full bg-white border rounded-xl px-4 py-3 text-sm font-bold focus:bg-accent text-white border-accent outline-none transition-colors shadow-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-black uppercase">Role / Profession</label>
            <input 
              type="text" 
              value={store.role}
              onChange={(e) => store.updateField('role', e.target.value)}
              className="w-full bg-white border rounded-xl px-4 py-3 text-sm font-bold focus:bg-accent text-white border-accent outline-none transition-colors shadow-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-black uppercase">Professional Summary</label>
            <textarea 
              value={store.summary}
              onChange={(e) => store.updateField('summary', e.target.value)}
              className="w-full bg-white border rounded-xl px-4 py-3 text-sm font-bold focus:bg-accent text-white border-accent outline-none transition-colors shadow-sm h-28 resize-none custom-scrollbar"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-black uppercase">Phone Number</label>
            <input 
              type="text" 
              value={store.phone}
              onChange={(e) => store.updateField('phone', e.target.value)}
              className="w-full bg-white border rounded-xl px-4 py-3 text-sm font-bold focus:bg-accent text-white border-accent outline-none transition-colors shadow-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-black uppercase">Email Address</label>
            <input 
              type="email" 
              value={store.email}
              onChange={(e) => store.updateField('email', e.target.value)}
              className="w-full bg-white border rounded-xl px-4 py-3 text-sm font-bold focus:bg-accent text-white border-accent outline-none transition-colors shadow-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-black uppercase">Home Address</label>
            <input 
              type="text" 
              value={store.address}
              onChange={(e) => store.updateField('address', e.target.value)}
              className="w-full bg-white border rounded-xl px-4 py-3 text-sm font-bold focus:bg-accent text-white border-accent outline-none transition-colors shadow-sm"
            />
          </div>
        </div>

        <div className="h-1 bg-foreground w-full" />

        {/* Custom Labels Section */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-foreground uppercase tracking-wider bg-white px-3 py-1 border border-border inline-block rounded-lg shadow-sm">Labels Translation</label>
            <p className="text-[10px] font-bold text-gray-500 mt-2 leading-tight">
              Change the text below to translate the CV into your preferred language (e.g., Indonesian).
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(store.labels).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase">{key}</label>
                <input 
                  type="text" 
                  value={value}
                  onChange={(e) => store.updateLabel(key as keyof typeof store.labels, e.target.value)}
                  className="w-full bg-white border rounded-xl px-2 py-1.5 text-xs font-bold focus:bg-accent text-white border-accent outline-none transition-colors shadow-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="h-1 bg-foreground w-full" />

        {/* Experience Section */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider bg-white px-3 py-1 border border-border inline-block rounded-lg shadow-sm">Experience</label>
              <button 
                onClick={store.addExperience}
                className="w-8 h-8 bg-accent border border-border rounded-xl text-white flex items-center justify-center hover:-translate-y-1 hover:shadow-none shadow-sm transition-all"
              >
                <Plus weight="bold" />
              </button>
            </div>
            <p className="text-[10px] font-bold text-gray-500 mt-2 leading-tight">
              Hapus semua item jika bagian ini tidak diperlukan di CV.
            </p>
          </div>
          
          <div className="space-y-6">
            {store.experiences.map((exp, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={exp.id} 
                className="p-4 bg-white border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 space-y-3 relative group"
              >
                <button 
                  onClick={() => store.removeExperience(exp.id)}
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 border border-border text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:scale-110 shadow-none"
                >
                  <Trash weight="bold" />
                </button>
                <div className="text-sm font-black bg-black text-white px-2 py-1 inline-block -mt-8 -ml-4 border-r-2 border-b border-border">#{idx + 1}</div>
                <input 
                  type="text" 
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => store.updateExperience(exp.id, 'title', e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-border rounded-xl px-3 py-2 text-sm font-bold focus:bg-white outline-none transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="Company & Duration"
                  value={exp.companyDuration}
                  onChange={(e) => store.updateExperience(exp.id, 'companyDuration', e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-border rounded-xl px-3 py-2 text-sm font-bold focus:bg-white outline-none transition-colors"
                />
                <textarea 
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => store.updateExperience(exp.id, 'description', e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-border rounded-xl px-3 py-2 text-sm font-bold focus:bg-white outline-none transition-colors h-20 resize-none custom-scrollbar"
                />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="h-1 bg-foreground w-full" />

        {/* Education Section */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider bg-white px-3 py-1 border border-border inline-block rounded-lg shadow-sm">Education</label>
              <button 
                onClick={store.addEducation}
                className="w-8 h-8 bg-accent border border-border rounded-xl text-white flex items-center justify-center hover:-translate-y-1 hover:shadow-none shadow-sm transition-all"
              >
                <Plus weight="bold" />
              </button>
            </div>
            <p className="text-[10px] font-bold text-gray-500 mt-2 leading-tight">
              Hapus semua item jika bagian ini tidak diperlukan di CV.
            </p>
          </div>
          
          <div className="space-y-6">
            {store.educations.map((edu, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={edu.id} 
                className="p-4 bg-white border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 space-y-3 relative group"
              >
                <button 
                  onClick={() => store.removeEducation(edu.id)}
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 border border-border text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:scale-110 shadow-none"
                >
                  <Trash weight="bold" />
                </button>
                <div className="text-sm font-black bg-black text-white px-2 py-1 inline-block -mt-8 -ml-4 border-r-2 border-b border-border">#{idx + 1}</div>
                <input 
                  type="text" 
                  placeholder="School / University Name"
                  value={edu.name}
                  onChange={(e) => store.updateEducation(edu.id, 'name', e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-border rounded-xl px-3 py-2 text-sm font-bold focus:bg-white outline-none transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="Year (e.g. 2018 - 2022)"
                  value={edu.year}
                  onChange={(e) => store.updateEducation(edu.id, 'year', e.target.value)}
                  className="w-full bg-[#F0F0F0] border border-border rounded-xl px-3 py-2 text-sm font-bold focus:bg-white outline-none transition-colors"
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="h-1 bg-foreground w-full" />

        {/* Hard Skills Section */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider bg-white px-3 py-1 border border-border inline-block rounded-lg shadow-sm">Hard Skills</label>
              <button 
                onClick={store.addHardSkill}
                className="w-8 h-8 bg-accent border border-border rounded-xl text-white flex items-center justify-center hover:-translate-y-1 hover:shadow-none shadow-sm transition-all"
              >
                <Plus weight="bold" />
              </button>
            </div>
            <p className="text-[10px] font-bold text-gray-500 mt-2 leading-tight">
              Hapus semua item jika bagian ini tidak diperlukan di CV.
            </p>
          </div>
          
          <div className="space-y-4">
            {store.hardSkills.map((skill, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={`hardskill-${idx}`} 
                className="p-3 bg-white border border-border rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-center gap-2 relative group"
              >
                <div className="flex-1 flex flex-col gap-2">
                  <input 
                    type="text" 
                    placeholder="Skill Name"
                    value={skill.name}
                    onChange={(e) => store.updateHardSkill(idx, 'name', e.target.value)}
                    className="w-full bg-[#F0F0F0] border border-border rounded-xl px-2 py-1 text-xs font-bold focus:bg-white outline-none transition-colors"
                  />
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" 
                      min="0" max="100"
                      value={skill.percent}
                      onChange={(e) => store.updateHardSkill(idx, 'percent', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs font-black w-10 text-right">{skill.percent}%</span>
                  </div>
                </div>
                <button 
                  onClick={() => store.removeHardSkill(idx)}
                  className="w-8 h-8 shrink-0 bg-red-500 border border-border rounded-xl text-white flex items-center justify-center hover:scale-110 shadow-none"
                >
                  <Trash weight="bold" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="h-1 bg-foreground w-full" />

        {/* Soft Skills Section */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider bg-white px-3 py-1 border border-border inline-block rounded-lg shadow-sm">Soft Skills</label>
              <button 
                onClick={store.addSoftSkill}
                className="w-8 h-8 bg-accent border border-border rounded-xl text-white flex items-center justify-center hover:-translate-y-1 hover:shadow-none shadow-sm transition-all"
              >
                <Plus weight="bold" />
              </button>
            </div>
            <p className="text-[10px] font-bold text-gray-500 mt-2 leading-tight">
              Hapus semua item jika bagian ini tidak diperlukan di CV.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {store.softSkills.map((skill, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                key={`softskill-${idx}`} 
                className="flex items-center bg-white border border-border rounded-xl shadow-none"
              >
                <input 
                  type="text" 
                  value={skill}
                  onChange={(e) => store.updateSoftSkill(idx, e.target.value)}
                  className="w-24 bg-transparent px-2 py-1 text-xs font-bold focus:bg-accent text-white border-accent outline-none transition-colors"
                />
                <button 
                  onClick={() => store.removeSoftSkill(idx)}
                  className="px-2 h-full border-l border-border bg-red-500 text-white hover:bg-black transition-colors"
                >
                  <Trash size={12} weight="bold" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AdSense Placeholder Sidebar */}
        <div className="print:hidden border-4 border-dashed border-border bg-white rounded-2xl p-4 text-center text-muted text-xs font-bold relative min-h-[120px] flex flex-col justify-center items-center mt-4">
          <span className="absolute top-2 right-4 px-2 py-0.5 bg-border text-[9px] uppercase tracking-widest text-muted-foreground rounded-full">Ads</span>
          <span className="text-[10px] opacity-75">Space Iklan AdSense Sidebar</span>
          <span className="text-[9px] opacity-50 mt-1">print:hidden (tidak dicetak di PDF)</span>
        </div>

      </div>
      </aside>
    </>
  );
}
