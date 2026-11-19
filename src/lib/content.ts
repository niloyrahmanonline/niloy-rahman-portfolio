export const profile = {
  name: "Niloy Rahman",
  role: "Creative Developer & Digital Creator",
  location: "Dinajpur, Bangladesh",
  email: "niloyrahman025@gmail.com",
  phone: "+8801806-896236",
  whatsapp: "https://wa.me/8801806896236",
  facebook: "https://www.facebook.com/profile.php?id=61594783026468",
  portrait: "/images/niloy-portrait.png",
  bio: "I’m Niloy Rahman, a creative developer and digital creator based in Dinajpur, Bangladesh. I build websites and apps, edit wedding films in Premiere Pro and After Effects, and refine photographs in Photoshop. I also work across cinematography and photography and offer digital subscriptions through NR Digital Subscription.",
};

export const navigation = [
  ["Home", "/"], ["About", "/about"], ["Services", "/services"],
  ["Portfolio", "/portfolio"], ["Subscriptions", "/digital-subscriptions"], ["Contact", "/contact"],
] as const;

export const services = [
  { slug: "web-app-development", icon: "code", name: "Web & App Development", tool: "Web applications", description: "Responsive websites and app interfaces built around clear navigation and thoughtful interaction.", details: ["Responsive website design", "Frontend development", "Application interfaces"] },
  { slug: "wedding-video-editing", icon: "film", name: "Wedding Video Editing", tool: "Premiere Pro + After Effects", description: "Wedding films shaped through pacing, sound, and color, with room for the moments that tell the story.", details: ["Highlight films", "Sequence editing and sound", "Color grading and motion graphics"] },
  { slug: "premium-photo-editing", icon: "image", name: "Premium Photo Editing", tool: "Photoshop", description: "Careful retouching and color refinement that keep the character of the original photograph.", details: ["Portrait retouching", "Color correction", "Image cleanup"] },
  { slug: "digital-subscriptions", icon: "layers", name: "Digital Subscriptions", tool: "NR Digital Subscription", description: "A catalog preview for creative, productivity, and entertainment subscriptions.", details: ["Creative tools", "Productivity tools", "Entertainment subscriptions"] },
  { slug: "cinematography-photography", icon: "camera", name: "Cinematography & Photography", tool: "Still & moving images", description: "Photography and cinematography with attention to light, composition, and the details of a scene.", details: ["Photography", "Cinematography", "Visual planning"] },
] as const;

export const projects = [
  { slug: "interface-study", title: "Minimal Interface Study", category: "Development", art: "interface", description: "An illustrative web interface study exploring a compact dashboard, readable hierarchy, and a restrained violet palette." },
  { slug: "wedding-film-study", title: "Wedding Film Study", category: "Film", art: "film", description: "A sample project outline for a wedding highlight film, with space for a licensed showreel and editing notes." },
  { slug: "portrait-grade-study", title: "Portrait Color Study", category: "Photography", art: "portrait", description: "An interactive illustration of how a color grade shifts the warmth and contrast of a portrait." },
] as const;

export const showreel: { src?: string; poster?: string; captions?: string } = {};

export const subscriptions = [
  { name: "Creative tools", icon: "image", description: "Editing, design, and production subscriptions." },
  { name: "Productivity tools", icon: "layers", description: "Subscriptions for organizing work and collaborating." },
  { name: "Entertainment", icon: "film", description: "Subscriptions for streaming and other media." },
] as const;