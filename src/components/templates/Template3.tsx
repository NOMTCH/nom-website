'use client';

import { useCVStore } from '@/store/cvStore';

export function Template3() {
  const store = useCVStore();

  const nameLength = store.fullName.length;
  const nameSizeClass = nameLength > 25 ? 'text-2xl' : nameLength > 15 ? 'text-3xl' : 'text-4xl';
  const themeColor = store.themeColor || '#D4AF37'; // Default elegant gold

  const getPhotoShapeClass = () => {
    switch (store.photoStyle) {
      case 'circle': return 'rounded-full';
      case 'arch': return 'rounded-tl-full rounded-tr-full rounded-bl-md rounded-br-md';
      case 'polygon': return '[clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]';
      case 'square':
      default: return 'rounded-none';
    }
  };

  return (
    <div className="flex h-[297mm] w-[210mm] bg-white text-gray-800 font-sans leading-relaxed relative overflow-hidden box-border">
      
      {/* Left Column (Sidebar) */}
      <div className="w-[35%] bg-gray-50 p-8 border-r border-gray-200 flex flex-col items-center">
        
        {/* Photo */}
        <div className={`w-32 h-32 overflow-hidden mb-6 shadow-md border-4 border-white ring-2 ring-gray-200 bg-gray-200 flex items-center justify-center flex-shrink-0 ${getPhotoShapeClass()}`}>
          {store.photoUrl ? (
            <img 
              src={store.photoUrl} 
              alt={store.fullName} 
              className="w-full h-full object-cover" 
              style={{ transform: `scale(${store.photoZoom})`, objectPosition: `${store.photoPanX}% ${store.photoPanY}%` }}
            />
          ) : (
            <span className="text-gray-400 font-medium text-xs">No Photo</span>
          )}
        </div>

        {/* Contact Info */}
        <div className="w-full mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-2 mb-4" style={{ color: themeColor, borderColor: themeColor }}>
            {store.labels.contact || 'Contact'}
          </h3>
          <div className="space-y-3 text-xs">
            {store.phone && (
              <div>
                <span className="font-bold text-gray-900 block">{store.labels.phone || 'Phone'}</span>
                <span>{store.phone}</span>
              </div>
            )}
            {store.email && (
              <div>
                <span className="font-bold text-gray-900 block">{store.labels.email || 'Email'}</span>
                <span className="break-all">{store.email}</span>
              </div>
            )}
            {store.address && (
              <div>
                <span className="font-bold text-gray-900 block">{store.labels.address || 'Location'}</span>
                <span>{store.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="w-full mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-2 mb-4" style={{ color: themeColor, borderColor: themeColor }}>
            {store.labels.skills || 'Expertise'}
          </h3>
          <div className="space-y-3">
            {store.hardSkills.map((skill, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold">{skill.name}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full" 
                    style={{ width: `${skill.percent}%`, backgroundColor: themeColor }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        {store.softSkills && store.softSkills.length > 0 && (
          <div className="w-full">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-2 mb-4" style={{ color: themeColor, borderColor: themeColor }}>
              {store.labels.softSkills || 'Strengths'}
            </h3>
            <ul className="text-xs space-y-1">
              {store.softSkills.map((skill, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }}></span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Right Column (Main Content) */}
      <div className="w-[65%] p-10 flex flex-col">
        
        {/* Header */}
        <header className="mb-8 pb-6 border-b border-gray-200">
          <h1 className={`${nameSizeClass} font-bold tracking-tight text-gray-900 mb-2 font-serif`}>
            {store.fullName}
          </h1>
          <h2 className="text-lg uppercase tracking-widest" style={{ color: themeColor }}>
            {store.role}
          </h2>
        </header>

        <div className="flex-1 flex flex-col gap-8">
          
          {/* Summary */}
          {store.summary && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-4 h-px" style={{ backgroundColor: themeColor }}></span>
                {store.labels.about || 'Profile'}
              </h3>
              <p className="text-xs leading-loose text-gray-600 text-justify break-words whitespace-pre-wrap">
                {store.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {store.experiences && store.experiences.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-4 h-px" style={{ backgroundColor: themeColor }}></span>
                {store.labels.experience || 'Experience'}
              </h3>
              <div className="space-y-6">
                {store.experiences.map((exp) => (
                  <div key={exp.id}>
                    <h4 className="text-sm font-bold text-gray-900">{exp.title}</h4>
                    <div className="text-xs font-semibold mb-2" style={{ color: themeColor }}>
                      {exp.companyDuration}
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600 text-justify">
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
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-4 h-px" style={{ backgroundColor: themeColor }}></span>
                {store.labels.education || 'Education'}
              </h3>
              <div className="space-y-4">
                {store.educations.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="text-sm font-bold text-gray-900">{edu.name}</h4>
                    <div className="text-xs font-semibold" style={{ color: themeColor }}>
                      {edu.year}
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
