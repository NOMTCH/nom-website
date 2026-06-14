'use client';

import { useCVStore } from '@/store/cvStore';

export function Template2() {
  const store = useCVStore();

  const nameLength = store.fullName.length;
  const nameSizeClass = nameLength > 25 ? 'text-2xl' : nameLength > 15 ? 'text-3xl' : 'text-4xl';

  const getPhotoStyleClasses = () => {
    switch (store.photoStyle) {
      case 'circle': return 'rounded-full aspect-square';
      case 'arch': return 'rounded-t-full rounded-b-none aspect-[3/4]';
      case 'polygon': return 'aspect-square [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]';
      default: return 'rounded-2xl aspect-[4/5]';
    }
  };

  return (
    <div className="flex h-[297mm] w-[210mm] bg-[#FAFAFA] text-black font-sans relative overflow-hidden box-border">
      
      {/* Accent Header Bar */}
      <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: 'var(--accent-cv)' }}></div>

      <div className="grid grid-cols-[220px_1fr] w-full h-full p-10 pt-12 gap-10 relative z-10">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col h-full space-y-8">
          
          {/* Photo */}
          <div className={`relative w-full bg-gray-200 overflow-hidden flex items-end justify-center group shadow-md ${getPhotoStyleClasses()}`}>
            {store.photoUrl ? (
              <img src={store.photoUrl} alt="Profile" className="w-full h-full object-cover filter saturate-75" />
            ) : (
              <div className="font-semibold text-gray-400 pb-4 text-xs tracking-widest">AVATAR</div>
            )}
          </div>

          {/* Contact Cards */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-4 pb-2 text-gray-800">
              {store.labels.contact}
            </h3>
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <div className="text-[10px] font-semibold uppercase text-gray-500 mb-0.5">{store.labels.phone}</div>
                <div className="font-medium text-gray-800 truncate">{store.phone}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase text-gray-500 mb-0.5">{store.labels.email}</div>
                <div className="font-medium text-gray-800 truncate">{store.email}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase text-gray-500 mb-0.5">{store.labels.address}</div>
                <div className="font-medium text-gray-800 line-clamp-2">{store.address || 'Jakarta, Indonesia'}</div>
              </div>
            </div>
          </section>

          {/* Soft Skills */}
          {store.softSkills && store.softSkills.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-4 pb-2 text-gray-800">
                {store.labels.softSkills}
              </h3>
              <div className="flex flex-wrap gap-2">
                {store.softSkills.map((skill, i) => (
                  <span key={i} className="text-[10px] font-medium px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: 'var(--accent-cv)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education Sidebar */}
          {store.educations && store.educations.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 mb-4 pb-2 text-gray-800">
                {store.labels.education}
              </h3>
              <div className="space-y-4">
                {store.educations.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="text-xs font-semibold text-gray-900">{edu.name}</h4>
                    <div className="text-[10px] text-gray-500 mt-0.5">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col h-full pt-2 pb-6">
          
          <header className="mb-10">
            <h1 className={`${nameSizeClass} font-bold uppercase tracking-tighter mb-3 leading-tight text-gray-900`}>
              {store.fullName}
            </h1>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-600 inline-block">
              {store.role}
            </h2>
          </header>

          {/* Summary */}
          {store.summary && (
            <section className="mb-10 break-inside-avoid">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-4 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-cv)' }}></span>
                {store.labels.about}
              </h3>
              <p className="text-xs leading-relaxed text-gray-700 text-justify break-words whitespace-pre-wrap">
                {store.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {store.experiences && store.experiences.length > 0 && (
            <section className="mb-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-5 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-cv)' }}></span>
                {store.labels.experience}
              </h3>
              <div className="space-y-6">
                {store.experiences.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid grid grid-cols-[100px_1fr] gap-4">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 pt-1">
                      {exp.companyDuration}
                    </div>
                    <div className="pl-4 border-l-2 border-gray-200">
                      <h4 className="text-sm font-bold text-gray-900 mb-1">{exp.title}</h4>
                      <p className="text-[11px] leading-relaxed text-gray-600 text-justify">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hard Skills */}
          {store.hardSkills && store.hardSkills.length > 0 && (
            <section className="break-inside-avoid">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-5 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-cv)' }}></span>
                {store.labels.skills}
              </h3>
              <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                {store.hardSkills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[10px] font-semibold uppercase mb-1.5 text-gray-700">
                      <span>{skill.name}</span>
                      <span>{skill.percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${skill.percent}%`, backgroundColor: 'var(--accent-cv)' }}
                      />
                    </div>
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
