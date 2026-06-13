'use client';

import { useCVStore } from '@/store/cvStore';

export function Template3() {
  const store = useCVStore();

  const getPhotoStyleClasses = () => {
    switch (store.photoStyle) {
      case 'circle': return 'rounded-full aspect-square';
      case 'arch': return 'rounded-t-full rounded-b-none aspect-[3/4]';
      case 'polygon': return 'aspect-square [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]';
      default: return 'rounded-none aspect-[3/4]';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white text-black font-sans p-[8mm] border-[8px] border-black">
      {/* Header Section */}
      <header className="mb-6 border-b-[6px] border-black pb-4 flex justify-between items-end">
        <div className="flex-1">
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-2" style={{ color: 'var(--accent-cv)' }}>
            {store.fullName}
          </h1>
          <h2 className="text-lg font-bold uppercase tracking-widest bg-black text-white inline-block px-3 py-1">
            {store.role}
          </h2>
        </div>
        
        {/* Contact Grid */}
        <div className="w-[30%] text-right space-y-1">
          <div className="text-[9px] font-bold uppercase flex justify-end gap-2">
            <span className="text-gray-500">{store.labels.phone}</span>
            <span className="w-24 text-right">{store.phone}</span>
          </div>
          <div className="text-[9px] font-bold uppercase flex justify-end gap-2">
            <span className="text-gray-500">{store.labels.email}</span>
            <span className="w-24 text-right truncate">{store.email}</span>
          </div>
          <div className="text-[9px] font-bold uppercase flex justify-end gap-2">
            <span className="text-gray-500">{store.labels.address}</span>
            <span className="w-24 text-right truncate">{store.address}</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-[1fr_200px] gap-6 flex-1">
        {/* LEFT COLUMN: Summary & Experience */}
        <div className="space-y-6">
          
          {/* Summary */}
          <section className="break-inside-avoid">
            <h3 className="text-xs font-black uppercase tracking-widest border-b-[3px] border-black mb-2 pb-1" style={{ color: 'var(--accent-cv)' }}>
              {store.labels.about}
            </h3>
            <p className="text-[10px] leading-relaxed font-medium text-justify">
              {store.summary}
            </p>
          </section>

          {/* Experience */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-widest border-b-[3px] border-black mb-3 pb-1" style={{ color: 'var(--accent-cv)' }}>
              {store.labels.experience}
            </h3>
            <div className="space-y-4">
              {store.experiences.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline border-b border-gray-300 mb-1 pb-1">
                    <h4 className="text-[11px] font-bold uppercase">{exp.title}</h4>
                    <span className="text-[9px] font-bold bg-gray-100 px-1.5 py-0.5">{exp.companyDuration}</span>
                  </div>
                  <p className="text-[9px] leading-relaxed mt-1.5 text-gray-800">
                    <span className="inline-block w-1.5 h-1.5 bg-black mr-2 align-middle"></span>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Skills, Education, Photo */}
        <div className="space-y-6">
          
          {/* Photo */}
          <div className={`w-full border-[3px] border-black overflow-hidden relative grayscale hover:grayscale-0 transition-all ${getPhotoStyleClasses()}`}>
            {store.photoUrl ? (
              <img src={store.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full border-3 border-black border-dashed flex items-center justify-center bg-gray-50 text-[10px] font-bold text-gray-400">
                PHOTO
              </div>
            )}
          </div>

          {/* Hard Skills */}
          <section className="break-inside-avoid">
            <h3 className="text-xs font-black uppercase tracking-widest border-b-[3px] border-black mb-2 pb-1" style={{ color: 'var(--accent-cv)' }}>
              {store.labels.skills}
            </h3>
            <div className="space-y-2">
              {store.hardSkills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[8px] font-bold uppercase mb-0.5">
                    <span>{skill.name}</span>
                    <span>{skill.percent}%</span>
                  </div>
                  <div className="w-full h-[3px] bg-gray-200">
                    <div 
                      className="h-full bg-black"
                      style={{ width: `${skill.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="break-inside-avoid">
            <h3 className="text-xs font-black uppercase tracking-widest border-b-[3px] border-black mb-2 pb-1" style={{ color: 'var(--accent-cv)' }}>
              {store.labels.education}
            </h3>
            <div className="space-y-2">
              {store.educations.map((edu) => (
                <div key={edu.id} className="relative pl-3 border-l-[2px] border-black">
                  <div className="absolute left-[-5.5px] top-1 w-[9px] h-[9px] bg-white border-[2px] border-black" />
                  <h4 className="text-[9px] font-bold uppercase leading-tight">{edu.name}</h4>
                  <div className="text-[8px] text-gray-500 font-medium mt-0.5">{edu.year}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Soft Skills */}
          <section className="break-inside-avoid">
            <div className="flex flex-wrap gap-1">
              {store.softSkills.map((skill, i) => (
                <span key={i} className="text-[7px] font-bold uppercase border border-black px-1.5 py-0.5">
                  {skill}
                </span>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
