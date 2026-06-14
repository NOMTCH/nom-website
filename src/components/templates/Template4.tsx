'use client';

import { useCVStore } from '@/store/cvStore';

export function Template4() {
  const store = useCVStore();

  const nameLength = store.fullName.length;
  const nameSizeClass = nameLength > 25 ? 'text-3xl' : nameLength > 15 ? 'text-4xl' : 'text-5xl';

  const getPhotoStyleClasses = () => {
    switch (store.photoStyle) {
      case 'circle': return 'rounded-full aspect-square';
      case 'arch': return 'rounded-t-full rounded-b-none aspect-[3/4]';
      case 'polygon': return 'aspect-square [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]';
      default: return 'rounded-none aspect-square';
    }
  };

  return (
    <div className="flex flex-col h-[297mm] w-[210mm] bg-white text-gray-800 font-sans relative overflow-hidden box-border">
      
      {/* Subtle Vector Background Accent */}
      <svg className="absolute top-0 right-0 w-[400px] h-[400px] text-gray-200 opacity-80 transform translate-x-1/4 -translate-y-1/4 pointer-events-none z-0" fill="none" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
        <path d="M5 50h90M50 5v90" stroke="currentColor" strokeWidth="0.5" />
        <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 50 50)" />
      </svg>

      {/* Header */}
      <header className="px-12 pt-12 pb-8 flex justify-between items-end border-b border-gray-200 relative z-10">
        <div className="flex-1">
          <h1 className={`${nameSizeClass} font-light tracking-tight text-gray-900 mb-2 font-serif`}>
            {store.fullName}
          </h1>
          <h2 className="text-sm uppercase tracking-widest text-gray-500 font-medium mb-6" style={{ color: 'var(--accent-cv)' }}>
            {store.role}
          </h2>
          <div className="flex flex-col gap-2 text-xs text-gray-600">
            {store.phone && <div className="flex items-center gap-3">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <span>{store.phone}</span>
            </div>}
            {store.email && <div className="flex items-center gap-3">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span>{store.email}</span>
            </div>}
            {store.address && <div className="flex items-center gap-3">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span>{store.address}</span>
            </div>}
          </div>
        </div>

        {/* Photo */}
        {store.photoUrl && (
          <div className={`w-32 bg-gray-100 overflow-hidden shadow-sm ${getPhotoStyleClasses()}`}>
            <img src={store.photoUrl} alt="Profile" className="w-full h-full object-cover grayscale" />
          </div>
        )}
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-[1fr_200px] gap-12 flex-1 px-12 py-10">
        
        {/* LEFT COLUMN: Experience & Summary */}
        <div className="flex flex-col gap-10">
          
          {/* Summary */}
          {store.summary && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {store.labels.about}
              </h3>
              <p className="text-[13px] leading-loose text-gray-700 font-serif text-justify break-words whitespace-pre-wrap">
                {store.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {store.experiences && store.experiences.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {store.labels.experience}
              </h3>
              <div className="space-y-8">
                {store.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">{exp.title}</h4>
                      <span className="text-xs text-gray-500 font-serif italic">{exp.companyDuration}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600 text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* RIGHT COLUMN: Skills & Education */}
        <div className="flex flex-col gap-10">
          
          {/* Hard Skills */}
          {store.hardSkills && store.hardSkills.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {store.labels.skills}
              </h3>
              <div className="space-y-4">
                {store.hardSkills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="text-xs text-gray-700 mb-1">
                      {skill.name}
                    </div>
                    <div className="w-full h-[1px] bg-gray-200">
                      <div 
                        className="h-full"
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
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {store.labels.softSkills}
              </h3>
              <ul className="space-y-2">
                {store.softSkills.map((skill, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Education */}
          {store.educations && store.educations.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {store.labels.education}
              </h3>
              <div className="space-y-5">
                {store.educations.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="text-xs font-semibold text-gray-800 mb-1 leading-snug">{edu.name}</h4>
                    <div className="text-[11px] text-gray-500 font-serif italic">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
