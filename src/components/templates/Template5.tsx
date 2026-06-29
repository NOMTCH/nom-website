'use client';

import { useCVStore } from '@/store/cvStore';

export function Template5() {
  const store = useCVStore();

  const nameLength = store.fullName.length;
  const nameSizeClass = nameLength > 25 ? 'text-3xl' : nameLength > 15 ? 'text-4xl' : 'text-5xl';
  const themeColor = store.themeColor || '#00FF00'; // Default to brutal green

  const getPhotoShapeClass = () => {
    switch (store.photoStyle) {
      case 'circle': return 'rounded-full';
      case 'arch': return 'rounded-tl-[50%] rounded-tr-[50%] rounded-bl-sm rounded-br-sm';
      case 'polygon': return '[clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]';
      case 'square':
      default: return 'rounded-none';
    }
  };

  return (
    <div className="flex flex-col h-[297mm] w-[210mm] bg-[#F4F4F0] text-black font-sans leading-tight relative overflow-hidden box-border p-10">
      
      {/* Brutalist Header Box */}
      <header className="mb-8 bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000000] flex justify-between items-center" style={{ boxShadow: `8px 8px 0 0 ${themeColor}, 10px 10px 0 0 #000` }}>
        <div className="flex-1 pr-4">
          <h1 className={`${nameSizeClass} font-black uppercase tracking-tighter mb-2`} style={{ textShadow: `2px 2px 0 ${themeColor}` }}>
            {store.fullName}
          </h1>
          <div className="text-xl font-bold uppercase tracking-widest bg-black text-white inline-block px-3 py-1 mb-4">
            {store.role}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold uppercase">
            {store.phone && <span className="border-2 border-black px-2 py-0.5 bg-white"><span className="text-gray-500 mr-1">{store.labels.phone || 'Phone'}:</span>{store.phone}</span>}
            {store.email && <span className="border-2 border-black px-2 py-0.5 bg-white"><span className="text-gray-500 mr-1">{store.labels.email || 'Email'}:</span>{store.email}</span>}
            {store.address && <span className="border-2 border-black px-2 py-0.5 bg-white"><span className="text-gray-500 mr-1">{store.labels.address || 'Address'}:</span>{store.address}</span>}
          </div>
        </div>
        
        {/* Photo */}
        <div className={`w-32 h-32 border-4 border-black bg-white shadow-[4px_4px_0_0_#000] flex-shrink-0 flex items-center justify-center overflow-hidden ${getPhotoShapeClass()}`}>
          {store.photoUrl ? (
            <img 
              src={store.photoUrl} 
              alt={store.fullName} 
              className="w-full h-full object-cover grayscale contrast-125" 
              style={{ transform: `scale(${store.photoZoom})`, objectPosition: `${store.photoPanX}% ${store.photoPanY}%` }}
            />
          ) : (
            <span className="font-black text-3xl">?</span>
          )}
        </div>
      </header>

      <div className="flex flex-1 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="w-[60%] flex flex-col gap-8">
          
          {/* Summary */}
          {store.summary && (
            <section className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_0_#000]">
              <h3 className="text-sm font-black uppercase tracking-widest bg-black text-white px-2 py-1 inline-block mb-3">
                {store.labels.about || 'ABOUT ME'}
              </h3>
              <p className="text-xs leading-relaxed text-black font-medium text-justify">
                {store.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {store.experiences && store.experiences.length > 0 && (
            <section className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_0_#000]">
              <h3 className="text-sm font-black uppercase tracking-widest bg-black text-white px-2 py-1 inline-block mb-4">
                {store.labels.experience || 'EXPERIENCE'}
              </h3>
              <div className="space-y-5">
                {store.experiences.map((exp) => (
                  <div key={exp.id} className="border-b-2 border-dashed border-gray-400 pb-3 last:border-0 last:pb-0">
                    <h4 className="text-sm font-black text-black uppercase">{exp.title}</h4>
                    <div className="text-xs font-bold mb-2 bg-gray-200 inline-block px-1">
                      {exp.companyDuration}
                    </div>
                    <p className="text-xs leading-relaxed font-medium">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Right Column (Sidebar) */}
        <div className="w-[40%] flex flex-col gap-8">
          
          {/* Education */}
          {store.educations && store.educations.length > 0 && (
            <section className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_0_#000]">
              <h3 className="text-sm font-black uppercase tracking-widest bg-black text-white px-2 py-1 inline-block mb-4">
                {store.labels.education || 'EDUCATION'}
              </h3>
              <div className="space-y-4">
                {store.educations.map((edu) => (
                  <div key={edu.id}>
                    <h4 className="text-xs font-black uppercase">{edu.name}</h4>
                    <div className="text-[10px] font-bold border-2 border-black inline-block px-1 mt-1" style={{ backgroundColor: themeColor }}>
                      {edu.year}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          <section className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_0_#000]">
            <h3 className="text-sm font-black uppercase tracking-widest bg-black text-white px-2 py-1 inline-block mb-4">
              {store.labels.skills || 'HARD SKILLS'}
            </h3>
            <div className="space-y-3">
              {store.hardSkills.map((skill, idx) => (
                <div key={idx}>
                  <div className="text-xs font-black uppercase mb-1">{skill.name}</div>
                  <div className="w-full border-2 border-black h-3 bg-white relative">
                    <div 
                      className="absolute top-0 left-0 h-full border-r-2 border-black" 
                      style={{ width: `${skill.percent}%`, backgroundColor: themeColor }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Soft Skills */}
          {store.softSkills && store.softSkills.length > 0 && (
            <section className="bg-white border-4 border-black p-5 shadow-[4px_4px_0_0_#000]">
              <h3 className="text-sm font-black uppercase tracking-widest bg-black text-white px-2 py-1 inline-block mb-4">
                {store.labels.softSkills || 'SOFT SKILLS'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {store.softSkills.map((skill, idx) => (
                  <span key={idx} className="text-[10px] font-black uppercase border-2 border-black px-2 py-1" style={{ backgroundColor: idx % 2 === 0 ? themeColor : '#FFF' }}>
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
