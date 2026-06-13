'use client';

import { useCVStore } from '@/store/cvStore';

export function Template2() {
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
    <div 
      className="flex h-full w-full bg-[#FAFAFA] text-black font-sans relative overflow-hidden"
    >
      {/* Neo-Brutalist Outer Frame */}
      <div className="absolute inset-2 border-2 border-black pointer-events-none z-20"></div>
      
      {/* Top Banner Accent */}
      <div className="w-full h-6 border-b-2 border-black" style={{ backgroundColor: 'var(--accent-cv)' }}></div>

      <div className="grid grid-cols-[200px_1fr] w-full h-full p-6 gap-6 relative z-10 pt-8">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col h-full space-y-6">
          
          {/* Photo */}
          <div className={`relative w-full border-2 border-black shadow-[4px_4px_0_0_#0F0F0F] bg-white overflow-hidden flex items-end justify-center group ${getPhotoStyleClasses()}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_150%)] opacity-20 pointer-events-none" />
            {store.photoUrl ? (
              <img src={store.photoUrl} alt="Profile" className="w-full h-full object-cover filter contrast-125 saturate-50" />
            ) : (
              <div className="font-bold text-gray-300 pb-4">AVATAR</div>
            )}
          </div>

          {/* Contact Cards */}
          <section className="space-y-3">
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_0_#0F0F0F]">
              <div className="text-[9px] font-black uppercase text-gray-500 mb-1">{store.labels.phone}</div>
              <div className="text-xs font-bold truncate">{store.phone}</div>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_0_#0F0F0F]">
              <div className="text-[9px] font-black uppercase text-gray-500 mb-1">{store.labels.email}</div>
              <div className="text-xs font-bold truncate">{store.email}</div>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_0_#0F0F0F]">
              <div className="text-[9px] font-black uppercase text-gray-500 mb-1">{store.labels.address}</div>
              <div className="text-xs font-bold line-clamp-2">{store.address || 'Jakarta, Indonesia'}</div>
            </div>
          </section>

          {/* Soft Skills */}
          <section>
            <h3 className="text-sm font-black uppercase tracking-widest border-b-[3px] border-black mb-4 pb-1">
              Capabilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {store.softSkills.map((skill, i) => (
                <span key={i} className="text-[9px] font-bold uppercase bg-black text-white px-2 py-1 shadow-[2px_2px_0_0_var(--accent-cv)]" style={{ '--accent-cv': store.themeColor } as React.CSSProperties}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col h-full pb-6">
          
          <header className="mb-8">
            <h1 className="text-5xl font-black uppercase leading-none tracking-tighter mb-2" style={{ color: 'var(--accent-cv)' }}>
              {store.fullName.split(' ').map((name, i) => (
                <span key={i} className={i === 0 ? "text-black" : "block"}>{name} </span>
              ))}
            </h1>
            <h2 className="text-[10px] font-bold uppercase tracking-widest bg-black text-white inline-block px-3 py-1 mt-1 shadow-[2px_2px_0_0_var(--accent-cv)]" style={{ '--accent-cv': store.themeColor } as React.CSSProperties}>
              {store.role}
            </h2>
          </header>

          {/* Summary */}
          <section className="mb-10 break-inside-avoid">
            <h3 className="text-sm font-black uppercase tracking-widest border-b-[3px] border-black mb-3 pb-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-black inline-block"></span>
              {store.labels.about}
            </h3>
            <p className="text-xs leading-relaxed font-bold bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_#0F0F0F]">
              {store.summary}
            </p>
          </section>

          {/* Experience */}
          <section className="mb-10 flex-1">
            <h3 className="text-sm font-black uppercase tracking-widest border-b-[3px] border-black mb-5 pb-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-black inline-block"></span>
              {store.labels.experience}
            </h3>
            <div className="space-y-6">
              {store.experiences.map((exp) => (
                <div key={exp.id} className="break-inside-avoid grid grid-cols-[100px_1fr] gap-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 pt-1">
                    {exp.companyDuration}
                  </div>
                  <div className="bg-white border-l-4 border-black pl-4">
                    <h4 className="text-sm font-bold uppercase mb-2">{exp.title}</h4>
                    <p className="text-[10px] leading-relaxed font-medium text-gray-600">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-8">
            {/* Skills */}
            <section className="break-inside-avoid">
              <h3 className="text-sm font-black uppercase tracking-widest border-b-[3px] border-black mb-5 pb-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-black inline-block"></span>
                {store.labels.skills}
              </h3>
              <div className="space-y-4">
                {store.hardSkills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[9px] font-bold uppercase mb-1">
                      <span>{skill.name}</span>
                      <span className="font-black">{skill.percent}%</span>
                    </div>
                    <div className="w-full h-[6px] bg-gray-200 border border-black overflow-hidden relative">
                      <div 
                        className="h-full border-r border-black"
                        style={{ width: `${skill.percent}%`, backgroundColor: 'var(--accent-cv)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="break-inside-avoid">
              <h3 className="text-sm font-black uppercase tracking-widest border-b-[3px] border-black mb-5 pb-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-black inline-block"></span>
                {store.labels.education}
              </h3>
              <div className="space-y-4">
                {store.educations.map((edu) => (
                  <div key={edu.id} className="relative pl-4 border-l-2 border-black">
                    <h4 className="text-[10px] font-bold uppercase">{edu.name}</h4>
                    <div className="text-[9px] font-black text-gray-500 mt-1">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>

      </div>
    </div>
  );
}
