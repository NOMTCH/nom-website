'use client';

import { useCVStore } from '@/store/cvStore';

export function Template4() {
  const store = useCVStore();

  const nameLength = store.fullName.length;
  const nameSizeClass = nameLength > 25 ? 'text-2xl' : nameLength > 15 ? 'text-3xl' : 'text-4xl';
  const themeColor = store.themeColor || '#1E3A8A'; // Default corporate blue

  // Determine if theme color is dark or light to set text color
  // A simple heuristic: if it's not white/yellow, use white text. 
  // We'll just assume white text for corporate theme sidebars.
  const sidebarTextColor = 'text-white';

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
    <div className="flex h-[297mm] w-[210mm] bg-white font-sans relative overflow-hidden box-border">
      
      {/* Left Column (Sidebar) */}
      <div className="w-[35%] p-8 flex flex-col" style={{ backgroundColor: themeColor }}>
        
        {/* Photo */}
        <div className={`w-full aspect-square bg-black/20 mb-8 border-4 border-white/20 overflow-hidden shadow-lg flex items-center justify-center ${getPhotoShapeClass()}`}>
          {store.photoUrl ? (
            <img 
              src={store.photoUrl} 
              alt={store.fullName} 
              className="w-full h-full object-cover" 
              style={{ transform: `scale(${store.photoZoom})`, objectPosition: `${store.photoPanX}% ${store.photoPanY}%` }}
            />
          ) : (
            <span className={`${sidebarTextColor} font-bold uppercase text-xs opacity-70`}>Photo</span>
          )}
        </div>

        {/* Contact Info */}
        <div className={`w-full mb-8 ${sidebarTextColor}`}>
          <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/30 pb-2 mb-4">
            {store.labels.contact || 'Contact'}
          </h3>
          <div className="space-y-4 text-xs font-medium">
            {store.phone && (
              <div>
                <span className="opacity-70 block mb-0.5">{store.labels.phone || 'Phone'}</span>
                <span>{store.phone}</span>
              </div>
            )}
            {store.email && (
              <div>
                <span className="opacity-70 block mb-0.5">{store.labels.email || 'Email'}</span>
                <span className="break-all">{store.email}</span>
              </div>
            )}
            {store.address && (
              <div>
                <span className="opacity-70 block mb-0.5">{store.labels.address || 'Address'}</span>
                <span>{store.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className={`w-full mb-8 ${sidebarTextColor}`}>
          <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/30 pb-2 mb-4">
            {store.labels.skills || 'Skills'}
          </h3>
          <div className="space-y-3">
            {store.hardSkills.map((skill, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold">{skill.name}</span>
                </div>
                <div className="w-full bg-black/30 h-1.5 rounded-sm">
                  <div 
                    className="h-1.5 bg-white rounded-sm" 
                    style={{ width: `${skill.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        {store.softSkills && store.softSkills.length > 0 && (
          <div className={`w-full ${sidebarTextColor}`}>
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/30 pb-2 mb-4">
              {store.labels.softSkills || 'Soft Skills'}
            </h3>
            <ul className="text-xs space-y-1.5 font-medium list-disc pl-4">
              {store.softSkills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Right Column (Main Content) */}
      <div className="w-[65%] p-10 flex flex-col bg-white text-gray-800">
        
        {/* Header */}
        <header className="mb-8 border-b-4 pb-6" style={{ borderColor: themeColor }}>
          <h1 className={`${nameSizeClass} font-black uppercase tracking-tight text-gray-900 mb-2`}>
            {store.fullName}
          </h1>
          <h2 className="text-lg uppercase tracking-widest font-semibold" style={{ color: themeColor }}>
            {store.role}
          </h2>
        </header>

        <div className="flex-1 flex flex-col gap-8">
          
          {/* Summary */}
          {store.summary && (
            <section>
              <h3 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: themeColor }}>
                {store.labels.about || 'Professional Summary'}
              </h3>
              <p className="text-xs leading-relaxed text-gray-700 text-justify break-words whitespace-pre-wrap">
                {store.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {store.experiences && store.experiences.length > 0 && (
            <section>
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                {store.labels.experience || 'Work Experience'}
              </h3>
              <div className="space-y-6">
                {store.experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: themeColor }}>
                    <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5" style={{ backgroundColor: themeColor }}></div>
                    <h4 className="text-sm font-bold text-gray-900">{exp.title}</h4>
                    <div className="text-xs font-bold text-gray-500 mb-2">
                      {exp.companyDuration}
                    </div>
                    <p className="text-xs leading-relaxed text-gray-700 text-justify">
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
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                {store.labels.education || 'Education'}
              </h3>
              <div className="space-y-4">
                {store.educations.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="text-sm font-bold text-gray-900">{edu.name}</h4>
                    <div className="text-xs font-bold text-gray-500">
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
