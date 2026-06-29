import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Experience = {
  id: string;
  title: string;
  companyDuration: string;
  description: string;
};

export type Education = {
  id: string;
  name: string;
  year: string;
};

export type Skill = {
  name: string;
  percent: number;
};

export type PhotoStyle = 'square' | 'circle' | 'arch' | 'polygon';

export interface CVStore {
  // Config
  templateId: number;
  themeColor: string;
  photoStyle: PhotoStyle;
  
  // Basic Info
  fullName: string;
  role: string;
  phone: string;
  email: string;
  address: string;
  summary: string;
  photoUrl: string | null;

  // Photo Adjustments
  photoZoom: number;
  photoPanX: number;
  photoPanY: number;

  // Labels
  labels: {
    about: string;
    experience: string;
    education: string;
    skills: string;
    softSkills: string;
    contact: string;
    phone: string;
    email: string;
    address: string;
  };

  // Data
  experiences: Experience[];
  educations: Education[];
  hardSkills: Skill[];
  softSkills: string[];

  // Actions
  setTemplateId: (id: number) => void;
  setThemeColor: (color: string) => void;
  setPhotoStyle: (style: PhotoStyle) => void;
  setPhotoAdjustments: (zoom: number, panX: number, panY: number) => void;
  updateField: <K extends keyof CVStore>(field: K, value: CVStore[K]) => void;
  updateLabel: (key: keyof CVStore['labels'], value: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: keyof Experience, value: string) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: keyof Education, value: string) => void;
  removeEducation: (id: string) => void;
  addHardSkill: () => void;
  updateHardSkill: (idx: number, field: keyof Skill, value: string | number) => void;
  removeHardSkill: (idx: number) => void;
  addSoftSkill: () => void;
  updateSoftSkill: (idx: number, value: string) => void;
  removeSoftSkill: (idx: number) => void;
}

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      templateId: 1,
      themeColor: '#000000',
      photoStyle: 'square',
      photoZoom: 1,
      photoPanX: 50,
      photoPanY: 50,
      fullName: 'JOSE UJANG DOS SANTOS',
      role: 'Tukang Ketik Kode (Fullstack Dev)',
      phone: '0812-3456-7890 (Kalo Gak Sibuk Mabar)',
      email: 'ujang.ronaldo@warnet.net',
      address: 'Kp. Bojong Gede, RT 07 / RW 08',
      photoUrl: null,
      summary: 'Developer penuh waktu, rebahan paruh waktu. Punya cita-cita bikin startup unicorn tapi masih sering typo pas ngetik "console.log()". Walaupun begitu, kalau disogok kopi, kode serumit apapun bakal jalan (walau gua sendiri kadang gak tau kenapa bisa jalan).',
      labels: {
        about: 'About Us',
        experience: 'Experience',
        education: 'Education',
        skills: 'Skills',
        softSkills: 'Core Strengths',
        contact: 'Contact',
        phone: 'Phone',
        email: 'Email',
        address: 'Address',
      },
      experiences: [
        {
          id: '1',
          title: 'SENIOR COPY-PASTER',
          companyDuration: 'StackOverflow Univ | 2021 - Present',
          description: 'Mengimplementasikan solusi tingkat tinggi dari internet ke dalam sistem perusahaan. Kalau error, ya cari lagi di Google sampai dapet yang centang ijo.',
        },
    {
      id: '2',
      title: 'TEKNISI WARNET IT SUPPORT',
      companyDuration: 'Warnet Barokah | 2018 - 2020',
      description: 'Ngebenerin billing yang nge-bug, nyolokin kabel LAN yang kendor digigit tikus, dan jadi penengah kalau bocil lagi berantem rebutan PC.',
    }
  ],
  educations: [
    { id: '1', name: 'UNIVERSITAS KEHIDUPAN (JURUSAN TAHAN BANTING)', year: '2015 - 2019' },
    { id: '2', name: 'YOUTUBE TUTORIAL (FAKULTAS WEB DEV)', year: '2019 - Present' }
  ],
  hardSkills: [
    { name: 'NGASAL KETIK JALAN', percent: 99 },
    { name: 'COPY PASTE KODE', percent: 95 },
    { name: 'CSS CENTERING DIV', percent: 10 },
    { name: 'NGELOBI HRD', percent: 85 }
  ],
  softSkills: ['Jago Ngeles pas Bug', 'Tahan Begadang', 'Pura-pura Sibuk pas Bos Lewat'],

  setTemplateId: (id) => set({ templateId: id }),
  setThemeColor: (color) => set({ themeColor: color }),
  setPhotoStyle: (style) => set({ photoStyle: style }),
  setPhotoAdjustments: (zoom, panX, panY) => set({ photoZoom: zoom, photoPanX: panX, photoPanY: panY }),
  updateField: (field, value) => set({ [field]: value }),
  updateLabel: (key, value) => set((state) => ({ labels: { ...state.labels, [key]: value } })),
  
  addExperience: () => set((state) => ({
    experiences: [
      ...state.experiences,
      { id: Date.now().toString(), title: '', companyDuration: '', description: '' }
    ]
  })),
  updateExperience: (id, field, value) => set((state) => ({
    experiences: state.experiences.map((exp) => 
      exp.id === id ? { ...exp, [field]: value } : exp
    )
  })),
  removeExperience: (id) => set((state) => ({
    experiences: state.experiences.filter((exp) => exp.id !== id)
  })),
  addEducation: () => set((state) => ({
    educations: [
      ...state.educations,
      { id: Date.now().toString(), name: '', year: '' }
    ]
  })),
  updateEducation: (id, field, value) => set((state) => ({
    educations: state.educations.map((edu) => 
      edu.id === id ? { ...edu, [field]: value } : edu
    )
  })),
  removeEducation: (id) => set((state) => ({
    educations: state.educations.filter((edu) => edu.id !== id)
  })),
  addHardSkill: () => set((state) => ({
    hardSkills: [
      ...state.hardSkills,
      { name: '', percent: 50 }
    ]
  })),
  updateHardSkill: (idx, field, value) => set((state) => {
    const newSkills = [...state.hardSkills];
    newSkills[idx] = { ...newSkills[idx], [field]: value };
    return { hardSkills: newSkills };
  }),
  removeHardSkill: (idx) => set((state) => {
    const newSkills = [...state.hardSkills];
    newSkills.splice(idx, 1);
    return { hardSkills: newSkills };
  }),
  addSoftSkill: () => set((state) => ({
    softSkills: [...state.softSkills, '']
  })),
  updateSoftSkill: (idx, value) => set((state) => {
    const newSkills = [...state.softSkills];
    newSkills[idx] = value;
    return { softSkills: newSkills };
  }),
  removeSoftSkill: (idx) => set((state) => {
    const newSkills = [...state.softSkills];
    newSkills.splice(idx, 1);
    return { softSkills: newSkills };
  })
    }),
    {
      name: 'cv-storage',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          return undefined; // Discard old cache, use initial state
        }
        return persistedState;
      },
      merge: (persistedState: unknown, currentState: CVStore) => {
        if (!persistedState) return currentState;
        const persisted = persistedState as Partial<CVStore>;
        return {
          ...currentState,
          ...persisted,
          labels: {
            ...currentState.labels,
            ...(persisted?.labels || {})
          }
        };
      }
    }
  )
);
