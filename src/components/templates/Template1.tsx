'use client';

import { useCVStore } from '@/store/cvStore';

export function Template1() {
  const store = useCVStore();

  const nameLength = store.fullName.length;
  const nameSizeClass = nameLength > 25 ? 'text-2xl' : nameLength > 15 ? 'text-3xl' : 'text-4xl';

  return (
    <div className="flex flex-col h-[297mm] w-[210mm] bg-white text-black font-sans leading-snug p-14 relative overflow-hidden box-border tracking-normal">
      
      {/* Header */}
      <header className="mb-6 text-center border-b-2 border-black pb-4">
        <h1 className={`${nameSizeClass} font-bold uppercase tracking-widest mb-1 text-black`}>
          {store.fullName}
        </h1>
        <div className="text-lg uppercase tracking-widest text-gray-800 mb-4 font-semibold">
          {store.role}
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-800 font-medium">
          {store.phone && <span><strong className="text-black">{store.labels.phone || 'Phone'}:</strong> {store.phone}</span>}
          {store.phone && store.email && <span>•</span>}
          {store.email && <span><strong className="text-black">{store.labels.email || 'Email'}:</strong> {store.email}</span>}
          {store.email && store.address && <span>•</span>}
          {store.address && <span><strong className="text-black">{store.labels.address || 'Address'}:</strong> {store.address}</span>}
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-6">
        
        {/* Summary */}
        {store.summary && (
          <section>
            <h3 className="text-sm font-bold uppercase border-b border-gray-400 mb-2 pb-1 tracking-widest text-black">
              {store.labels.about || 'Professional Summary'}
            </h3>
            <p className="text-xs leading-relaxed text-justify text-gray-900 break-words whitespace-pre-wrap">
              {store.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {store.experiences && store.experiences.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1 tracking-widest text-black">
              {store.labels.experience || 'Professional Experience'}
            </h3>
            <div className="space-y-4">
              {store.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-bold text-black">{exp.title}</h4>
                    <span className="text-xs font-semibold text-gray-700">
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
            <h3 className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1 tracking-widest text-black">
              {store.labels.education || 'Education'}
            </h3>
            <div className="space-y-3">
              {store.educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <h4 className="text-sm font-bold text-black">{edu.name}</h4>
                  <span className="text-xs font-semibold text-gray-700">
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        <section>
          <h3 className="text-sm font-bold uppercase border-b border-gray-400 mb-3 pb-1 tracking-widest text-black">
            {store.labels.skills || 'Skills & Expertise'}
          </h3>
          <div className="text-xs leading-relaxed text-gray-900 flex flex-col gap-2">
            {store.hardSkills && store.hardSkills.length > 0 && (
              <div>
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
