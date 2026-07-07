import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(dateString))
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '…'
}

export function getOrderStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20',
    processing: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20',
    shipped: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20',
    delivered: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
    cancelled: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
  }
  return map[status] ?? 'text-gray-600 bg-gray-50'
}

export const YEARS = Array.from({ length: 30 }, (_, i) => 2024 - i)

export const MAKES = [
  { name: 'Toyota', models: ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Land Cruiser', 'Yaris'] },
  { name: 'BMW', models: ['3 Series', '5 Series', 'X3', 'X5', '1 Series', '7 Series'] },
  { name: 'Ford', models: ['Focus', 'Fiesta', 'Mustang', 'Ranger', 'Explorer', 'Transit'] },
  { name: 'Volkswagen', models: ['Golf', 'Polo', 'Passat', 'Tiguan', 'Touareg', 'Caddy'] },
  { name: 'Mercedes-Benz', models: ['C-Class', 'E-Class', 'GLC', 'A-Class', 'S-Class', 'Sprinter'] },
  { name: 'Honda', models: ['Civic', 'CR-V', 'Jazz', 'Accord', 'HR-V', 'Pilot'] },
  { name: 'Audi', models: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'] },
  { name: 'Nissan', models: ['Qashqai', 'X-Trail', 'Leaf', 'Navara', 'Juke', 'Micra'] },
]
