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
      themeColor: '#00FF00',
      photoStyle: 'square',
      fullName: 'MAMAN RACING',
      role: 'Tukang Setting Mesin Kanan',
      phone: '0812 3456 NGENG',
      email: 'maman@ngeng.com',
      address: '',
      photoUrl: null,
      summary: 'Seorang spesialis mesin kanan yang hobi sunmori tiap minggu pagi. Berdedikasi tinggi terhadap kecepatan dan estetika motor. Moto hidup: \'Mending nyesel beli daripada nyesel gak beli\'. Selalu siap gasspoll dalam setiap project yang diberikan!',
      labels: {
        about: 'About',
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
          title: 'KEPALA MEKANIK BALAP',
          companyDuration: 'Bengkel Ngeng Racing | 2018 - 2024',
          description: 'Mengatur dan menyetting karburator pe28 dan blok seher agar tarikan motor semakin ngacir dan gampang wheelie di lampu merah. Juga berpengalaman modif knalpot mberr.',
        },
    {
      id: '2',
      title: 'ASISTEN TUKANG TAMBAL BAN',
      companyDuration: 'Tambal Ban Mas Bro | 2015 - 2018',
      description: 'Membantu menambal ban bocor dengan metode tubles maupun dibakar. Spesialis nambal ban truk dan motor matic pake karet ban dalem bekas.',
    }
  ],
  educations: [
    { id: '1', name: 'UNIVERSITAS BALAP LIAR, S.T', year: '2015 - 2019' },
    { id: '2', name: 'SMKN 1 OTOMOTIF', year: '2012 - 2015' },
    { id: '3', name: 'SMPN 1 JALUR LURUS', year: '2009 - 2012' },
    { id: '4', name: 'SD INPRES NGENG NGENG', year: '2003 - 2009' }
  ],
  hardSkills: [
    { name: 'SETTING KARBU PE28', percent: 95 },
    { name: 'NYETEL KLEP MOTOR', percent: 90 },
    { name: 'MODIF KNALPOT MBERR', percent: 100 },
    { name: 'GANTI OLI GARDAN', percent: 85 },
    { name: 'NGECAT VELG KALENG', percent: 80 }
  ],
  softSkills: ['Leadership', 'Communication'],


  setTemplateId: (id) => set({ templateId: id }),
  setThemeColor: (color) => set({ themeColor: color }),
  setPhotoStyle: (style) => set({ photoStyle: style }),
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
      merge: (persistedState: unknown, currentState: CVStore) => {
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
