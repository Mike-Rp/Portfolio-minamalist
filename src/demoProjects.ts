// Temporary Projects page demonstration data. Replace these records with verified work later.
// The genuine homepage project records live separately in homepageData.ts.
export type DemoProject = {
  id: string;
  name: string;
  category: string;
  description: string;
  imagePath: string | null;
  imageFit: 'cover' | 'contain';
  imagePosition: string;
  technologies: string[];
  projectUrl: string | null;
  detailPageUrl?: string | null;
  placeholder: boolean;
};

export const softwareDemoProjects: DemoProject[] = [
  { id: 'task-management', name: 'Task Management System', category: 'Building Software', description: 'A web application for organizing tasks, projects, and team workflows.', technologies: ['React', 'TypeScript', 'Supabase'] },
  { id: 'inventory-management', name: 'Inventory Management System', category: 'Building Software', description: 'A dashboard for monitoring inventory, products, and stock movements.', technologies: ['React', 'Tailwind CSS', 'MySQL'] },
  { id: 'appointment-booking', name: 'Appointment Booking Platform', category: 'Building Software', description: 'An online platform for managing bookings and customer appointments.', technologies: ['JavaScript', 'PHP', 'MySQL'] },
  { id: 'budget-tracker-demo', name: 'Budget Tracker', category: 'Building Software', description: 'A personal finance dashboard for organizing expenses and budgets.', technologies: ['React', 'CSS', 'JavaScript'] },
  { id: 'ecommerce-demo', name: 'E-Commerce Application', category: 'Building Software', description: 'An online shopping platform with product listings and order management.', technologies: ['Next.js', 'Tailwind CSS', 'MongoDB'] },
  { id: 'logistics-management', name: 'Logistics Management System', category: 'Building Software', description: 'A centralized platform for tracking deliveries, vehicles, and operations.', technologies: ['React', 'TypeScript', 'Supabase'] },
].map(project => ({ ...project, imagePath: null, imageFit: 'contain', imagePosition: 'center', projectUrl: null, detailPageUrl: null, placeholder: true }));

export const designDemoProjects: DemoProject[] = [
  { id: 'brand-identity', name: 'Brand Identity Design', category: 'Branding & Visual Identity' },
  { id: 'mobile-app-ui', name: 'Mobile Application UI', category: 'UI/UX Design' },
  { id: 'sports-posters', name: 'Sports Poster Collection', category: 'Sports Graphic Design' },
  { id: 'social-campaign', name: 'Social Media Campaign', category: 'Social Media Graphics' },
].map(project => ({ ...project, description: '', imagePath: null, imageFit: 'contain', imagePosition: 'center', technologies: [], projectUrl: null, detailPageUrl: null, placeholder: true }));
