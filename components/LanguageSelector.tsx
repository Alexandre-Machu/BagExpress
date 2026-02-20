'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Language } from '@/lib/translations'
import { useState, useRef, useEffect } from 'react'

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: 'GB' },
  { code: 'fr', name: 'Français', flag: 'FR' },
  { code: 'de', name: 'Deutsch', flag: 'DE' },
  { code: 'es', name: 'Español', flag: 'ES' },
  { code: 'pt', name: 'Português', flag: 'PT' },
  { code: 'ja', name: '日本語', flag: 'JP' },
  { code: 'zh', name: '中文', flag: 'CN' },
  { code: 'ru', name: 'Русский', flag: 'RU' },
]

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Languages className="h-5 w-5 text-gray-600" />
        <span className="text-sm font-semibold text-gray-700">{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-gray-700">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center space-x-3 ${
                language === lang.code ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
              }`}
            >
              <span className="text-sm font-semibold text-gray-600">{lang.flag}</span>
              <span>{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-primary-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
