'use client';

import { useCVStore } from '@/store/cvStore';

export function Template3() {
  const store = useCVStore();

  const nameLength = store.fullName.length;
  const nameSizeClass = nameLength > 25 ? 'text-3xl' : nameLength > 15 ? 'text-4xl' : 'text-[2.75rem]';

  const getPhotoStyleClasses = () => {
    switch (store.photoStyle) {
      case 'circle': return 'rounded-full aspect-square';
      case 'arch': return 'rounded-t-full rounded-b-none aspect-[3/4]';
      case 'polygon': return 'aspect-square [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]';
      default: return 'rounded-xl aspect-square';
    }
  };

  return (
    <div className="flex flex-col h-[297mm] w-[210mm] bg-white text-gray-800 font-sans relative overflow-hidden box-border">
      
      {/* Header Block */}
      <header className="px-10 py-10 flex justify-between items-center gap-8 text-white relative shadow-sm" style={{ backgroundColor: 'var(--accent-cv)' }}>
        
        {/* Title & Contact */}
        <div className="flex flex-col justify-center max-w-[70%]">
          <h1 className={`${nameSizeClass} font-black uppercase tracking-tight mb-0.5 leading-none drop-shadow-md`}>
            {store.fullName}
          </h1>
          <h2 className="text-sm font-semibold tracking-widest uppercase text-white/90 mb-4">
            {store.role}
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-white/95">
            {store.phone && <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              {store.phone}
            </div>}
            {store.email && <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              {store.email}
            </div>}
            {store.address && <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {store.address}
            </div>}
          </div>
        </div>

        {/* Photo */}
        {store.photoUrl && (
          <div className={`relative w-28 border-[3px] border-white/90 shadow-md overflow-hidden flex-shrink-0 bg-white/20 backdrop-blur-sm ${getPhotoStyleClasses()}`}>
            <img src={store.photoUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-[1fr_220px] gap-8 p-10 flex-1">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          
          {/* Summary */}
          {store.summary && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2" style={{ color: 'var(--accent-cv)' }}>
                {store.labels.about}
              </h3>
              <p className="text-xs leading-relaxed text-gray-700 text-justify break-words whitespace-pre-wrap">
                {store.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {store.experiences && store.experiences.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4" style={{ color: 'var(--accent-cv)' }}>
                {store.labels.experience}
              </h3>
              <div className="space-y-5">
                {store.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-[13px] font-bold text-gray-900">{exp.title}</h4>
                      <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{exp.companyDuration}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-700 text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6 border-l border-gray-200 pl-8">
          
          {/* Education */}
          {store.educations && store.educations.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4" style={{ color: 'var(--accent-cv)' }}>
                {store.labels.education}
              </h3>
              <div className="space-y-4">
                {store.educations.map((edu) => (
                  <div key={edu.id} className="relative">
                    <h4 className="text-xs font-bold text-gray-900 mb-0.5">{edu.name}</h4>
                    <div className="text-[10px] text-gray-500 font-medium">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hard Skills */}
          {store.hardSkills && store.hardSkills.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4" style={{ color: 'var(--accent-cv)' }}>
                {store.labels.skills}
              </h3>
              <div className="space-y-3">
                {store.hardSkills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[10px] font-semibold text-gray-700 mb-1">
                      <span>{skill.name}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ width: `${skill.percent}%`, backgroundColor: 'var(--accent-cv)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Soft Skills */}
          {store.softSkills && store.softSkills.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3" style={{ color: 'var(--accent-cv)' }}>
                {store.labels.softSkills}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {store.softSkills.map((skill, i) => (
                  <span key={i} className="text-[9px] font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-200">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
