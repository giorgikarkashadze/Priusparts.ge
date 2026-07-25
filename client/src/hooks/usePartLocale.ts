// client/src/hooks/usePartLocale.ts
import { useTranslation } from 'react-i18next'
import type { Part, Category } from '@/types/types'

export function usePartLocale(part: Part) {
  const { i18n } = useTranslation()
  const isKa = i18n.language.startsWith('ka')
  return {
    name: isKa && part.nameKa ? part.nameKa : part.name,
    description: isKa && part.descriptionKa ? part.descriptionKa : part.description,
  }
}

export function getCategoryName(category: Category | undefined, lang: string): string {
  if (!category) return ''
  return lang.startsWith('ka') && category.nameKa ? category.nameKa : category.name
}

export function getPartName(part: Part, lang: string): string {
  return lang.startsWith('ka') && part.nameKa ? part.nameKa : part.name
}

export function getPartDescription(part: Part, lang: string): string {
  return lang.startsWith('ka') && part.descriptionKa ? part.descriptionKa : part.description ?? ''
}