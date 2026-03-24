export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  featured: boolean;
  accentColor: string;
  bgPattern: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Volta Brand Identity",
    category: "Graphic Design",
    year: "2024",
    description: "Complete visual identity for a next-gen electric mobility startup.",
    tags: ["Branding", "Logo", "Print"],
    featured: true,
    accentColor: "#20FF00",
    bgPattern: "radial-gradient(circle at 30% 70%, #20FF0015 0%, transparent 60%)",
  },
  {
    id: "2",
    title: "Ōkami Digital Store",
    category: "Web Design",
    year: "2024",
    description: "Immersive e-commerce experience for a Japanese streetwear label.",
    tags: ["Web", "UI/UX", "Motion"],
    featured: true,
    accentColor: "#FF6B35",
    bgPattern: "radial-gradient(circle at 70% 30%, #FF6B3515 0%, transparent 60%)",
  },
  {
    id: "3",
    title: "Aurora Wedding Invite",
    category: "Digital Invitations",
    year: "2024",
    description: "Animated northern lights themed digital wedding invitation.",
    tags: ["Invitation", "Animation", "Motion"],
    featured: true,
    accentColor: "#A855F7",
    bgPattern: "radial-gradient(circle at 50% 50%, #A855F715 0%, transparent 60%)",
  },
  {
    id: "4",
    title: "Neon Pulse Festival",
    category: "Graphic Design",
    year: "2023",
    description: "Full visual identity and collateral for an electronic music festival.",
    tags: ["Branding", "Event", "Print"],
    featured: false,
    accentColor: "#00D4FF",
    bgPattern: "radial-gradient(circle at 20% 80%, #00D4FF15 0%, transparent 60%)",
  },
  {
    id: "5",
    title: "Lumina Portfolio Site",
    category: "Web Design",
    year: "2023",
    description: "Portfolio website for an award-winning photographer.",
    tags: ["Web", "Portfolio", "UI/UX"],
    featured: false,
    accentColor: "#F59E0B",
    bgPattern: "radial-gradient(circle at 80% 20%, #F59E0B15 0%, transparent 60%)",
  },
  {
    id: "6",
    title: "Bloom Corp Launch",
    category: "Digital Invitations",
    year: "2023",
    description: "Interactive product launch invitation for a beauty brand.",
    tags: ["Invitation", "Corporate", "Interactive"],
    featured: false,
    accentColor: "#EC4899",
    bgPattern: "radial-gradient(circle at 40% 60%, #EC489915 0%, transparent 60%)",
  },
];
