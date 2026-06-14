'use client';

import { useCVStore } from '@/store/cvStore';

export function Template1() {
  const store = useCVStore();

  const nameLength = store.fullName.length;
  const nameSizeClass = nameLength > 25 ? 'text-2xl' : nameLength > 15 ? 'text-3xl' : 'text-4xl';

  return (
    <div className="flex flex-col h-[297mm] w-[210mm] bg-white text-black font-serif leading-snug p-12 relative overflow-hidden box-border">
      
      {/* Header */}
      <header className="mb-6 text-center border-b-[2px] border-black pb-6">
        <h1 className={`${nameSizeClass} font-bold uppercase tracking-widest mb-2 text-black`}>
          {store.fullName}
        </h1>
        <div className="text-lg uppercase tracking-wider text-gray-800 mb-4 font-semibold">
          {store.role}
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-800">
          {store.phone && <span>{store.phone}</span>}
          {store.email && <span>{store.email}</span>}
          {store.address && <span>{store.address}</span>}
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-6">
        
        {/* Summary */}
        {store.summary && (
          <section>
            <h3 className="text-md font-bold uppercase border-b border-gray-400 mb-3 pb-1 tracking-widest text-black">
              {store.labels.about || 'Professional Summary'}
            </h3>
            <p className="text-sm leading-relaxed text-justify text-gray-900 break-words whitespace-pre-wrap">
              {store.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {store.experiences && store.experiences.length > 0 && (
          <section>
            <h3 className="text-md font-bold uppercase border-b border-gray-400 mb-3 pb-1 tracking-widest text-black">
              {store.labels.experience || 'Professional Experience'}
            </h3>
            <div className="space-y-4">
              {store.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-bold text-black">{exp.title}</h4>
                    <span className="text-xs italic text-gray-700">
                      {exp.companyDuration}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-justify text-gray-800">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {store.educations && store.educations.length > 0 && (
          <section>
            <h3 className="text-md font-bold uppercase border-b border-gray-400 mb-3 pb-1 tracking-widest text-black">
              {store.labels.education || 'Education'}
            </h3>
            <div className="space-y-3">
              {store.educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <h4 className="text-sm font-bold text-black">{edu.name}</h4>
                  <span className="text-xs italic text-gray-700">
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        <section>
          <h3 className="text-md font-bold uppercase border-b border-gray-400 mb-3 pb-1 tracking-widest text-black">
            {store.labels.skills || 'Skills & Expertise'}
          </h3>
          <div className="text-sm leading-relaxed text-gray-900">
            {store.hardSkills && store.hardSkills.length > 0 && (
              <div className="mb-2">
                <span className="font-bold text-black">{store.labels.skills}:</span> {store.hardSkills.map(s => s.name).join(', ')}
              </div>
            )}
            {store.softSkills && store.softSkills.length > 0 && (
              <div>
                <span className="font-bold text-black">{store.labels.softSkills}:</span> {store.softSkills.join(', ')}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
