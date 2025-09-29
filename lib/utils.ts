import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = new Date();
  const target = new Date(date);
  const diffInMs = target.getTime() - now.getTime();
  const diffInMinutes = Math.round(diffInMs / (1000 * 60));
  const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute');
  } else if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  } else {
    return rtf.format(diffInDays, 'day');
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function calculateCGPA(grades: { credits: number; grade: number }[]): number {
  if (!grades.length) return 0;
  
  const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
  const weightedSum = grades.reduce((sum, g) => sum + g.credits * g.grade, 0);
  
  return Math.round((weightedSum / totalCredits) * 100) / 100;
}

export function generateQRCodeData(studentId: string, institutionId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartstudenthub.com';
  return `${baseUrl}/verify/${institutionId}/${studentId}`;
}

export function parseSearchParams(searchParams: URLSearchParams) {
  const parsed: Record<string, string | string[]> = {};
  
  for (const [key, value] of searchParams.entries()) {
    if (parsed[key]) {
      if (Array.isArray(parsed[key])) {
        (parsed[key] as string[]).push(value);
      } else {
        parsed[key] = [parsed[key] as string, value];
      }
    } else {
      parsed[key] = value;
    }
  }
  
  return parsed;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

export function generatePassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export const skillCategories = {
  technical: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 
    'Angular', 'Vue.js', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'HTML', 'CSS', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'Linux'
  ],
  soft: [
    'Leadership', 'Communication', 'Teamwork', 'Problem Solving',
    'Project Management', 'Time Management', 'Critical Thinking',
    'Creativity', 'Adaptability', 'Public Speaking', 'Negotiation'
  ],
  design: [
    'UI/UX Design', 'Graphic Design', 'Adobe Photoshop', 'Adobe Illustrator',
    'Figma', 'Sketch', 'Web Design', 'Mobile Design', 'Prototyping',
    'User Research', 'Design Thinking'
  ],
  business: [
    'Marketing', 'Sales', 'Business Analysis', 'Strategy', 'Finance',
    'Accounting', 'Operations', 'Supply Chain', 'Consulting',
    'Entrepreneurship', 'Digital Marketing', 'SEO', 'Content Marketing'
  ],
  research: [
    'Data Analysis', 'Statistical Analysis', 'Research Methodology',
    'Academic Writing', 'Literature Review', 'Experimental Design',
    'MATLAB', 'R', 'SPSS', 'LaTeX', 'Scientific Writing'
  ]
};
