'use client'

import Link from 'next/link'
import { Backpack, MapPin, Shield, Clock, ChevronRight, User, LogOut } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSelector from '@/components/LanguageSelector'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function Home() {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Backpack className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">BagExpress</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-primary-600">{t.nav.features}</Link>
            <Link href="#how-it-works" className="text-gray-700 hover:text-primary-600">{t.nav.howItWorks}</Link>
            <Link href="/driver" className="text-gray-700 hover:text-primary-600">{t.nav.becomeDriver}</Link>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            {mounted && session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{t.nav.greeting}, {session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.nav.logout}</span>
                </button>
              </div>
            ) : mounted ? (
              <Link href="/login" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                <User className="w-4 h-4" />
                <span>{t.nav.login}</span>
              </Link>
            ) : (
              <div className="w-20 h-8"></div>
            )}
            <Link href="/book" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
              {t.nav.book}
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                {t.home.heroTitle}<br />
                <span className="text-primary-600">{t.home.heroTitleHighlight}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t.home.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/book" 
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition text-center text-lg font-semibold flex items-center justify-center"
                >
                  {t.home.bookNow}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/driver" 
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition text-center text-lg font-semibold border-2 border-primary-600"
                >
                  {t.home.becomeDriver}
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white p-8 rounded-2xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1553697388-94e804e2f0f6?w=600&h=400&fit=crop" 
                  alt="Chauffeur avec bagages"
                  className="rounded-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            {t.home.whyChoose}
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.home.timeSaving}</h3>
              <p className="text-gray-600">{t.home.timeSavingDesc}</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.home.maxSecurity}</h3>
              <p className="text-gray-600">{t.home.maxSecurityDesc}</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.home.realTimeTracking}</h3>
              <p className="text-gray-600">{t.home.realTimeTrackingDesc}</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Backpack className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t.home.totalFlexibility}</h3>
              <p className="text-gray-600">{t.home.totalFlexibilityDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            {t.home.howItWorksTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t.home.step1Title}</h3>
              <p className="text-gray-600">
                {t.home.step1Desc}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t.home.step2Title}</h3>
              <p className="text-gray-600">
                {t.home.step2Desc}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t.home.step3Title}</h3>
              <p className="text-gray-600">
                {t.home.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t.home.ctaTitle}
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            {t.home.ctaDescription}
          </p>
          <Link 
            href="/book" 
            className="bg-white text-primary-600 px-12 py-4 rounded-lg hover:bg-gray-100 transition text-lg font-semibold inline-flex items-center"
          >
            {t.home.bookFirstRide}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Backpack className="h-6 w-6" />
                <span className="text-xl font-bold">BagExpress</span>
              </div>
              <p className="text-gray-400">{t.home.footer.tagline}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.home.footer.product}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white">{t.nav.features}</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white">{t.nav.howItWorks}</Link></li>
                <li><Link href="/book" className="hover:text-white">{t.home.footer.pricing}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.home.footer.company}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">{t.home.footer.about}</Link></li>
                <li><Link href="/driver" className="hover:text-white">{t.nav.becomeDriver}</Link></li>
                <li><Link href="#" className="hover:text-white">{t.home.footer.contact}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t.home.footer.legal}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">{t.home.footer.terms}</Link></li>
                <li><Link href="#" className="hover:text-white">{t.home.footer.privacy}</Link></li>
                <li><Link href="#" className="hover:text-white">{t.home.footer.insurance}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t.home.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
