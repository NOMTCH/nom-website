'use client';

import { useCVStore } from '@/store/cvStore';

export function Template1() {
  const store = useCVStore();

  const getPhotoStyleClasses = () => {
    switch (store.photoStyle) {
      case 'circle': return 'rounded-full aspect-square';
      case 'arch': return 'rounded-t-full rounded-b-none aspect-[3/4]';
      case 'polygon': return 'aspect-square [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]';
      default: return 'rounded-none aspect-square';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white text-black font-sans leading-tight border-[8px] border-black p-6 relative">
      
      {/* Brutalist Top Right Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 border-b-[6px] border-l-[6px] border-black" style={{ backgroundColor: 'var(--accent-cv)' }}></div>

      <header className="mb-8 relative z-10">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 bg-black text-white inline-block px-2 py-0.5">
          {store.labels.about}
        </h2>
        <h1 className="text-5xl font-black uppercase leading-none tracking-tighter mb-2 max-w-[80%]">
          {store.fullName}
        </h1>
        <div className="text-lg font-black uppercase tracking-widest text-gray-800" style={{ color: 'var(--accent-cv)' }}>
          {store.role}
        </div>
      </header>

      <div className="grid grid-cols-[1fr_220px] gap-8 flex-1">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          <section className="break-inside-avoid">
            <p className="text-[11px] leading-relaxed font-bold border-l-[4px] pl-4 border-black">
              {store.summary}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-black uppercase border-b-[3px] border-black mb-4 pb-1 inline-block">
              {store.labels.experience}
            </h3>
            <div className="space-y-5">
              {store.experiences.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-[11px] font-bold uppercase leading-none">{exp.title}</h4>
                    <span className="text-[9px] font-bold border-2 border-black px-1.5 py-0.5 shadow-[2px_2px_0_0_#0F0F0F] bg-white">
                      {exp.companyDuration}
                    </span>
                  </div>
                  <p className="text-[10px] leading-relaxed font-medium text-gray-800 mt-1.5">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="space-y-6">

          <div className={`w-full border-2 border-black shadow-[4px_4px_0_0_#0F0F0F] bg-gray-100 overflow-hidden mb-6 flex items-center justify-center ${getPhotoStyleClasses()}`}>
            {store.photoUrl ? (
              <img src={store.photoUrl} alt="Profile" className="w-full h-full object-cover filter contrast-125" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-gray-400 uppercase text-[10px]">Foto</div>
            )}
          </div>

          <section className="break-inside-avoid">
            <h3 className="text-sm font-black uppercase border-b-4 border-black mb-4 pb-1">
              {store.labels.contact}
            </h3>
            <div className="space-y-3 text-xs font-bold">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase">{store.labels.phone}</span>
                <span>{store.phone}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase">{store.labels.email}</span>
                <span>{store.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-500 uppercase">{store.labels.address}</span>
                <span>{store.address}</span>
              </div>
            </div>
          </section>

          <section className="break-inside-avoid">
            <h3 className="text-sm font-black uppercase border-b-4 border-black mb-4 pb-1">
              {store.labels.skills}
            </h3>
            <div className="space-y-4">
              {store.hardSkills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                    <span>{skill.name}</span>
                    <span>{skill.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-white border-2 border-black">
                    <div 
                      className="h-full bg-black border-r-2 border-black"
                      style={{ width: `${skill.percent}%`, backgroundColor: 'var(--accent-cv)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="break-inside-avoid">
            <h3 className="text-sm font-black uppercase border-b-4 border-black mb-4 pb-1">
              {store.labels.education}
            </h3>
            <div className="space-y-4">
              {store.educations.map((edu) => (
                <div key={edu.id} className="relative pl-4 border-l-4 border-black">
                  <h4 className="text-xs font-black uppercase">{edu.name}</h4>
                  <div className="text-[10px] font-bold text-gray-500 mt-1">{edu.year}</div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
