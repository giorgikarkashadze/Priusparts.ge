import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language?.startsWith('ka') ? 'ka' : 'en'

  return (
    <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: 3 }}>
      {(['en', 'ka'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => i18n.changeLanguage(lang)}
          style={{
            padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
            background: current === lang ? 'linear-gradient(135deg, #4C7CFF, #22D3B8)' : 'transparent',
            color: current === lang ? '#04121A' : '#7C8AA5',
            transition: 'all 0.15s'
          }}
        >
          {lang === 'en' ? 'EN' : 'ქა'}
        </button>
      ))}
    </div>
  )
}