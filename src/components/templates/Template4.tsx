'use client';

import { useCVStore } from '@/store/cvStore';

export function Template4() {
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
    <div className="flex h-full w-full bg-[#0F0F0F] text-gray-300 font-sans p-[8mm] relative overflow-hidden">
      {/* Futuristic Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,var(--accent-cv),transparent_70%)] opacity-20 pointer-events-none" style={{ '--accent-cv': store.themeColor } as React.CSSProperties} />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[radial-gradient(circle_at_bottom_left,var(--accent-cv),transparent_70%)] opacity-10 pointer-events-none" style={{ '--accent-cv': store.themeColor } as React.CSSProperties} />
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* Main Container */}
      <div className="flex flex-col h-full w-full relative z-10 border border-gray-800 bg-black/40 backdrop-blur-sm p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        
        {/* Top Glitch Line */}
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-cv)] to-transparent opacity-50 absolute top-0 left-0" style={{ '--accent-cv': store.themeColor } as React.CSSProperties} />

        <header className="grid grid-cols-[1fr_120px] gap-6 mb-6 mt-2">
          <div className="flex flex-col justify-center">
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] mb-1.5" style={{ color: 'var(--accent-cv)' }}>
              {store.labels.about}
            </h2>
            <h1 className="text-4xl font-black uppercase leading-none tracking-tighter text-white mb-1.5">
              {store.fullName}
            </h1>
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-400">
              {store.role}
            </h3>
            <div className="mt-3 flex gap-3 text-[8px] font-bold uppercase tracking-wider text-gray-500">
              <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--accent-cv)' }}></span>{store.phone}</span>
              <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--accent-cv)' }}></span>{store.email}</span>
            </div>
          </div>
          
          <div className={`w-full border-2 relative overflow-hidden ${getPhotoStyleClasses()}`} style={{ borderColor: 'var(--accent-cv)' }}>
            <div className="absolute -inset-1 border border-gray-800" />
            {store.photoUrl ? (
              <img src={store.photoUrl} alt="Profile" className="w-full h-full object-cover grayscale brightness-110 contrast-125 mix-blend-luminosity" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-gray-700 bg-black">SYS.IMG</div>
            )}
            {/* Cyber Corner Marks */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] bg-[#0F0F0F]" style={{ borderColor: 'var(--accent-cv)' }} />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] bg-[#0F0F0F]" style={{ borderColor: 'var(--accent-cv)' }} />
          </div>
        </header>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-[1fr_1fr] gap-x-8 gap-y-8 flex-1">
          
          {/* Summary */}
          <section className="col-span-2 break-inside-avoid bg-[#1A1A1A] p-4 border-l-4" style={{ borderColor: 'var(--accent-cv)' }}>
            <p className="text-[11px] leading-relaxed font-medium text-gray-300">
              {store.summary}
            </p>
          </section>

          {/* Left Col: Experience */}
          <div className="space-y-8">
            <section className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[8px] font-mono text-gray-600">01.</span>
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  {store.labels.experience}
                </h3>
                <div className="flex-1 h-[1px] bg-gray-800" />
              </div>
              
              <div className="space-y-4">
                {store.experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l border-gray-800 break-inside-avoid group">
                    <div className="absolute left-[-2.5px] top-1.5 w-[4px] h-[4px] rotate-45 transition-colors group-hover:bg-white" style={{ backgroundColor: 'var(--accent-cv)' }} />
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-[10px] font-bold text-white uppercase">{exp.title}</h4>
                      <span className="text-[8px] font-mono text-gray-500">{exp.companyDuration}</span>
                    </div>
                    <p className="text-[8px] leading-relaxed text-gray-400 font-mono mt-1">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-6">
            
            {/* Hard Skills */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[8px] font-mono text-gray-600">02.</span>
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  {store.labels.skills}
                </h3>
                <div className="flex-1 h-[1px] bg-gray-800" />
              </div>
              
              <div className="space-y-2.5">
                {store.hardSkills.map((skill, idx) => (
                  <div key={idx} className="break-inside-avoid">
                    <div className="flex justify-between text-[7px] font-mono uppercase mb-1 text-gray-400">
                      <span>{skill.name}</span>
                      <span style={{ color: 'var(--accent-cv)' }}>{skill.percent}%</span>
                    </div>
                    <div className="w-full h-[2px] bg-gray-900 overflow-hidden">
                      <div 
                        className="h-full relative"
                        style={{ width: `${skill.percent}%`, backgroundColor: 'var(--accent-cv)' }}
                      >
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-r from-transparent to-white opacity-30" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[8px] font-mono text-gray-600">03.</span>
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  {store.labels.education}
                </h3>
                <div className="flex-1 h-[1px] bg-gray-800" />
              </div>

              <div className="space-y-3">
                {store.educations.map((edu) => (
                  <div key={edu.id} className="break-inside-avoid bg-gray-900/50 p-2 border border-gray-800">
                    <h4 className="text-[9px] font-bold text-white uppercase">{edu.name}</h4>
                    <div className="text-[8px] font-mono text-gray-500 mt-0.5">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Soft Skills */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[8px] font-mono text-gray-600">04.</span>
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  SYS.MODULES
                </h3>
                <div className="flex-1 h-[1px] bg-gray-800" />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {store.softSkills.map((skill, i) => (
                  <span key={i} className="text-[7px] font-mono uppercase border border-gray-700 px-1.5 py-0.5 text-gray-400 bg-black">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
