export interface Service {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  icon: string;
  number: string;
  features: string[];
  deliverables: string[];
  color: string;
}

export const services: Service[] = [
  {
    id: "graphic-design",
    slug: "graphic-design",
    title: "Graphic Design",
    shortTitle: "GRAPHIC",
    description:
      "Visual identities, brand systems, and print materials that leave a lasting impression.",
    longDescription:
      "We craft bold visual identities and brand systems that transcend trends. From logo design and brand guidelines to print collateral and packaging — every pixel is intentional.",
    icon: "◈",
    number: "01",
    features: [
      "Brand Identity & Logo Design",
      "Print & Banner Design",
      "Social Media Visual Kits",
      "Flyers, Brochures & Packaging",
    ],
    deliverables: [
      "Logo files (SVG, PNG, PDF)",
      "Brand guideline document",
      "Color & typography system",
      "Social media kit",
    ],
    color: "#20FF00",
  },
  {
    id: "web-design",
    slug: "web-design",
    title: "Web Design",
    shortTitle: "WEB",
    description:
      "Modern, responsive websites and digital experiences built for performance and impact.",
    longDescription:
      "We design and develop digital experiences that convert. From marketing sites to complex web apps — performance, accessibility, and aesthetics are never compromised.",
    icon: "◎",
    number: "02",
    features: [
      "Website Design & Development",
      "Landing Page Design",
      "UI/UX Design",
      "Motion & Interaction Design",
      "E-Commerce Solutions",
      "CMS Integration",
    ],
    deliverables: [
      "Figma design files",
      "Developed website",
      "CMS setup & training",
      "Performance optimized build",
    ],
    color: "#20FF00",
  },
  {
    id: "digital-invitation",
    slug: "digital-invitation",
    title: "Digital Invitations",
    shortTitle: "INVITE",
    description:
      "Bespoke animated digital invitations for events, weddings, and brand launches.",
    longDescription:
      "We create unforgettable digital invitations with custom animations, interactive RSVP forms, and unique motion design. Perfect for weddings, corporate events, and product launches.",
    icon: "◉",
    number: "03",
    features: [
      "Animated Invitation Design",
      "Interactive RSVP Integration",
      "Custom Illustration",
      "Motion & Micro-animations",
      "Multi-language Support",
      "Mobile-first Design",
    ],
    deliverables: [
      "Animated invitation file",
      "Web-based invite link",
      "RSVP dashboard",
      "WhatsApp/Email ready format",
    ],
    color: "#20FF00",
  },
];
