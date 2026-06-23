import { MONTH_NAMES } from '@/data/mockData';

export function formatEventDate(iso: string): string {
  const date = new Date(iso);
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()].slice(0, 3).toLowerCase();
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

export function formatDuration(minutes: number): string {
  return minutes >= 60 ? `${minutes / 60} hr` : `${minutes} min`;
}
