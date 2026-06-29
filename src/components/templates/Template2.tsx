'use client';

import { useCVStore } from '@/store/cvStore';

export function Template2() {
  const store = useCVStore();

  const nameLength = store.fullName.length;
  const nameSizeClass = nameLength > 25 ? 'text-xl' : nameLength > 15 ? 'text-2xl' : 'text-3xl';

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
    <div className="flex flex-col h-[297mm] w-[210mm] bg-white text-black font-serif leading-snug p-12 relative overflow-hidden box-border">
      
      {/* Header Container */}
      <div className="flex justify-between items-start mb-6 border-b-4 border-black pb-4">
        {/* Text Info */}
        <div className="flex-1 pr-4">
          <h1 className={`${nameSizeClass} font-bold uppercase tracking-wider mb-1 text-[#000080]`}>
            {store.fullName}
          </h1>
          <div className="text-sm font-bold uppercase tracking-widest text-black mb-3">
            {store.role}
          </div>
          
          <div className="flex flex-col gap-1 text-xs text-black font-medium">
            {store.phone && <div><span className="font-bold w-16 inline-block">{store.labels.phone || 'Phone'}:</span> {store.phone}</div>}
            {store.email && <div><span className="font-bold w-16 inline-block">{store.labels.email || 'Email'}:</span> {store.email}</div>}
            {store.address && <div><span className="font-bold w-16 inline-block">{store.labels.address || 'Address'}:</span> {store.address}</div>}
          </div>
        </div>

        {/* Pas Foto 3x4 */}
        <div className={`w-[3cm] h-[4cm] border-2 border-black flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-100 ${getPhotoShapeClass()}`}>
          {store.photoUrl ? (
            <img 
              src={store.photoUrl} 
              alt="Pas Foto" 
              className="w-full h-full object-cover" 
              style={{ transform: `scale(${store.photoZoom})`, objectPosition: `${store.photoPanX}% ${store.photoPanY}%` }}
            />
          ) : (
            <span className="text-[10px] text-gray-500 font-bold uppercase text-center px-2">Pas Foto<br/>3x4</span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-5">
        
        {/* Summary */}
        {store.summary && (
          <section>
            <h3 className="text-sm font-bold uppercase bg-[#000080] text-white px-2 py-1 mb-2 tracking-widest">
              {store.labels.about || 'Profil Singkat'}
            </h3>
            <p className="text-xs leading-relaxed text-justify text-black break-words whitespace-pre-wrap px-2">
              {store.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {store.experiences && store.experiences.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase bg-[#000080] text-white px-2 py-1 mb-3 tracking-widest">
              {store.labels.experience || 'Riwayat Pekerjaan'}
            </h3>
            <div className="space-y-4 px-2">
              {store.experiences.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-black">
                  <div className="absolute w-2 h-2 bg-[#000080] rounded-full -left-[5px] top-1"></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-bold text-black">{exp.title}</h4>
                    <span className="text-xs font-bold text-gray-800">
                      {exp.companyDuration}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-justify text-black">
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
            <h3 className="text-sm font-bold uppercase bg-[#000080] text-white px-2 py-1 mb-3 tracking-widest">
              {store.labels.education || 'Riwayat Pendidikan'}
            </h3>
            <div className="space-y-2 px-2">
              {store.educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline border-b border-gray-300 pb-1">
                  <h4 className="text-sm font-bold text-black">{edu.name}</h4>
                  <span className="text-xs font-bold text-gray-800">
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        <section>
          <h3 className="text-sm font-bold uppercase bg-[#000080] text-white px-2 py-1 mb-3 tracking-widest">
            {store.labels.skills || 'Keahlian & Kompetensi'}
          </h3>
          <div className="text-xs leading-relaxed text-black px-2 grid grid-cols-2 gap-4">
            {store.hardSkills && store.hardSkills.length > 0 && (
              <div>
                <div className="font-bold mb-1 border-b border-gray-400 inline-block pb-0.5">{store.labels.skills} Teknis:</div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {store.hardSkills.map((s, idx) => (
                    <li key={idx}>{s.name}</li>
                  ))}
                </ul>
              </div>
            )}
            {store.softSkills && store.softSkills.length > 0 && (
              <div>
                <div className="font-bold mb-1 border-b border-gray-400 inline-block pb-0.5">{store.labels.softSkills}:</div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {store.softSkills.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
