'use client';

import { useCVStore } from '@/store/cvStore';

export function Template6() {
  const store = useCVStore();

  const nameLength = store.fullName.length;
  const nameSizeClass = nameLength > 25 ? 'text-3xl' : nameLength > 15 ? 'text-4xl' : 'text-5xl';
  const themeColor = store.themeColor || '#1A1A1A'; // Default dark charcoal

  const getPhotoShapeClass = () => {
    switch (store.photoStyle) {
      case 'circle': return 'rounded-full';
      case 'arch': return 'rounded-tl-full rounded-tr-full rounded-bl-sm rounded-br-sm';
      case 'polygon': return '[clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]';
      case 'square':
      default: return 'rounded-none';
    }
  };

  return (
    <div className="flex flex-col h-[297mm] w-[210mm] bg-[#FAFAFA] text-[#2C2C2C] font-sans leading-relaxed relative overflow-hidden box-border p-14">
      
      {/* Header */}
      <header className="flex items-center gap-10 mb-12">
        {/* Photo */}
        <div className={`w-36 h-36 flex-shrink-0 overflow-hidden bg-gray-200 border border-gray-300 ${getPhotoShapeClass()}`}>
          {store.photoUrl ? (
            <img 
              src={store.photoUrl} 
              alt={store.fullName} 
              className="w-full h-full object-cover filter contrast-110" 
              style={{ transform: `scale(${store.photoZoom})`, objectPosition: `${store.photoPanX}% ${store.photoPanY}%` }}
            />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-light uppercase tracking-widest">Photo</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className={`${nameSizeClass} font-light tracking-tight text-[#111] mb-1`} style={{ fontFamily: 'Georgia, serif' }}>
            {store.fullName}
          </h1>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: themeColor }}>
            {store.role}
          </h2>
          
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-light text-gray-500">
            {store.phone && <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full" style={{ backgroundColor: themeColor }}></span><span className="font-semibold">{store.labels.phone || 'Phone'}:</span> {store.phone}</span>}
            {store.email && <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full" style={{ backgroundColor: themeColor }}></span><span className="font-semibold">{store.labels.email || 'Email'}:</span> {store.email}</span>}
            {store.address && <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full" style={{ backgroundColor: themeColor }}></span><span className="font-semibold">{store.labels.address || 'Address'}:</span> {store.address}</span>}
          </div>
        </div>
      </header>

      <div className="flex gap-12 flex-1">
        
        {/* Left Column */}
        <div className="w-[60%] flex flex-col gap-10">
          
          {/* Summary */}
          {store.summary && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-4 pb-2 border-b border-gray-200">
                {store.labels.about || 'Profile'}
              </h3>
              <p className="text-xs leading-loose font-light text-justify text-gray-700">
                {store.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {store.experiences && store.experiences.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-6 pb-2 border-b border-gray-200">
                {store.labels.experience || 'Experience'}
              </h3>
              <div className="space-y-8">
                {store.experiences.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="absolute -left-4 top-1.5 w-1 h-1 rounded-full" style={{ backgroundColor: themeColor }}></div>
                    <h4 className="text-sm font-medium text-gray-900">{exp.title}</h4>
                    <div className="text-[11px] font-light text-gray-500 mb-3 tracking-wide">
                      {exp.companyDuration}
                    </div>
                    <p className="text-[11px] leading-loose font-light text-gray-700 text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Right Column */}
        <div className="w-[40%] flex flex-col gap-10">
          
          {/* Education */}
          {store.educations && store.educations.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-6 pb-2 border-b border-gray-200">
                {store.labels.education || 'Education'}
              </h3>
              <div className="space-y-5">
                {store.educations.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="text-[13px] font-medium text-gray-900 mb-1">{edu.name}</h4>
                    <div className="text-[11px] font-light text-gray-500 tracking-wide">
                      {edu.year}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hard Skills */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-6 pb-2 border-b border-gray-200">
              {store.labels.skills || 'Expertise'}
            </h3>
            <div className="space-y-4">
              {store.hardSkills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[11px] font-light text-gray-700 mb-1.5">
                    <span>{skill.name}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-[2px]">
                    <div 
                      className="h-[2px]" 
                      style={{ width: `${skill.percent}%`, backgroundColor: themeColor }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Soft Skills */}
          {store.softSkills && store.softSkills.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-6 pb-2 border-b border-gray-200">
                {store.labels.softSkills || 'Strengths'}
              </h3>
              <div className="flex flex-wrap gap-y-2 gap-x-4">
                {store.softSkills.map((skill, idx) => (
                  <span key={idx} className="text-[11px] font-light text-gray-700 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
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
