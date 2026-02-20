'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Backpack, MapPin, Package, Calendar, CreditCard, ArrowLeft, CheckCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSelector from '@/components/LanguageSelector'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Import Map dynamically to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/Map'), { ssr: false })

type BaggageSize = 'small' | 'medium' | 'large' | 'xlarge'

interface BookingData {
  pickupLocation: string
  deliveryLocation: string
  pickupCoords: [number, number]
  deliveryCoords: [number, number]
  baggageSize: BaggageSize
  baggageCount: number
  pickupTime: string
  specialInstructions: string
}

interface AddressSuggestion {
  display_name: string
  lat: string
  lon: string
}

const baggagePrices: Record<BaggageSize, number> = {
  small: 8,
  medium: 12,
  large: 18,
  xlarge: 25,
}

export default function BookingPage() {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    pickupLocation: '',
    deliveryLocation: '',
    pickupCoords: [48.8566, 2.3522],
    deliveryCoords: [48.8606, 2.3376],
    baggageSize: 'medium',
    baggageCount: 1,
    pickupTime: '',
    specialInstructions: '',
  })
  
  // Autocompletion states
  const [pickupSuggestions, setPickupSuggestions] = useState<AddressSuggestion[]>([])
  const [deliverySuggestions, setDeliverySuggestions] = useState<AddressSuggestion[]>([])
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDeliverySuggestions, setShowDeliverySuggestions] = useState(false)
  
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Search addresses using Nominatim API
  const searchAddresses = async (query: string, setSuggestions: (s: AddressSuggestion[]) => void) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=fr,de,es,pt,it,be&addresstype=attraction,railway_station,hotel&amenitytype=station,accommodation`
      )
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error('Address search error:', error)
      setSuggestions([])
    }
  }

  // Debounced search for pickup location
  useEffect(() => {
    const timer = setTimeout(() => {
      searchAddresses(bookingData.pickupLocation, setPickupSuggestions)
    }, 300)
    return () => clearTimeout(timer)
  }, [bookingData.pickupLocation])

  // Debounced search for delivery location
  useEffect(() => {
    const timer = setTimeout(() => {
      searchAddresses(bookingData.deliveryLocation, setDeliverySuggestions)
    }, 300)
    return () => clearTimeout(timer)
  }, [bookingData.deliveryLocation])

  const selectPickupAddress = (suggestion: AddressSuggestion) => {
    setBookingData({
      ...bookingData,
      pickupLocation: suggestion.display_name,
      pickupCoords: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)],
    })
    setShowPickupSuggestions(false)
  }

  const selectDeliveryAddress = (suggestion: AddressSuggestion) => {
    setBookingData({
      ...bookingData,
      deliveryLocation: suggestion.display_name,
      deliveryCoords: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)],
    })
    setShowDeliverySuggestions(false)
  }

  const calculatePrice = () => {
    const basePrice = baggagePrices[bookingData.baggageSize] * bookingData.baggageCount
    const serviceFee = 2
    return basePrice + serviceFee
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Vérifier si l'utilisateur est connecté
    if (!session) {
      router.push('/login')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: session.user.id,
          customerName: session.user.name,
          customerPhone: session.user.phone || '+33 6 00 00 00 00',
          pickupLocation: bookingData.pickupLocation,
          pickupCoords: bookingData.pickupCoords,
          deliveryLocation: bookingData.deliveryLocation,
          deliveryCoords: bookingData.deliveryCoords,
          baggageSize: bookingData.baggageSize,
          baggageCount: bookingData.baggageCount,
          specialInstructions: bookingData.specialInstructions,
          pickupTime: new Date(bookingData.pickupTime).toISOString(),
          price: calculatePrice(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking')
      }

      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
      console.error('Booking error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.booking.bookingConfirmed}</h1>
          <p className="text-gray-600 mb-6">
            {t.booking.driverWillAccept}
          </p>
          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">{t.booking.totalPrice}</span>
              <span className="font-semibold text-xl">{calculatePrice()}€</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">{t.booking.pickup}</span>
              <span className="font-semibold">{bookingData.pickupLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t.booking.delivery}</span>
              <span className="font-semibold">{bookingData.deliveryLocation}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Link 
              href="/dashboard" 
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition inline-block"
            >
              Voir ma réservation
            </Link>
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition"
            >
              {t.booking.backToHome}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            <Backpack className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">BagExpress</span>
          </Link>
          <LanguageSelector />
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire de réservation */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.booking.title}</h1>

              {/* Étapes */}
              <div className="flex items-center justify-between mb-8">
                <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="ml-2 font-semibold hidden sm:inline">{t.booking.step1}</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-gray-200">
                  <div className={`h-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
                </div>
                <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="ml-2 font-semibold hidden sm:inline">{t.booking.step2}</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-gray-200">
                  <div className={`h-full ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`} style={{ width: step >= 3 ? '100%' : '0%' }}></div>
                </div>
                <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <span className="ml-2 font-semibold hidden sm:inline">{t.booking.step3}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Étape 1: Itinéraire */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="inline h-5 w-5 mr-2" />
                        {t.booking.pickupLocation}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={t.booking.pickupPlaceholder}
                        value={bookingData.pickupLocation}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, pickupLocation: e.target.value })
                          setShowPickupSuggestions(true)
                        }}
                        onFocus={() => setShowPickupSuggestions(true)}
                      />
                      {showPickupSuggestions && pickupSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {pickupSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => selectPickupAddress(suggestion)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 transition"
                            >
                              <div className="font-medium text-gray-900">{suggestion.display_name.split(',')[0]}</div>
                              <div className="text-sm text-gray-500">{suggestion.display_name}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="inline h-5 w-5 mr-2" />
                        {t.booking.deliveryLocation}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={t.booking.deliveryPlaceholder}
                        value={bookingData.deliveryLocation}
                        onChange={(e) => {
                          setBookingData({ ...bookingData, deliveryLocation: e.target.value })
                          setShowDeliverySuggestions(true)
                        }}
                        onFocus={() => setShowDeliverySuggestions(true)}
                      />
                      {showDeliverySuggestions && deliverySuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {deliverySuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => selectDeliveryAddress(suggestion)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 transition"
                            >
                              <div className="font-medium text-gray-900">{suggestion.display_name.split(',')[0]}</div>
                              <div className="text-sm text-gray-500">{suggestion.display_name}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!bookingData.pickupLocation || !bookingData.deliveryLocation}
                      className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                    >
                      {t.booking.continue}
                    </button>
                  </div>
                )}

                {/* Étape 2: Détails */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Package className="inline h-5 w-5 mr-2" />
                        {t.booking.baggageSize}
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: 'small', label: t.booking.small, desc: t.booking.smallDesc, price: 8 },
                          { value: 'medium', label: t.booking.medium, desc: t.booking.mediumDesc, price: 12 },
                          { value: 'large', label: t.booking.large, desc: t.booking.largeDesc, price: 18 },
                          { value: 'xlarge', label: t.booking.xlarge, desc: t.booking.xlargeDesc, price: 25 },
                        ].map((size) => (
                          <button
                            key={size.value}
                            type="button"
                            onClick={() => setBookingData({ ...bookingData, baggageSize: size.value as BaggageSize })}
                            className={`p-4 border-2 rounded-lg text-left transition ${
                              bookingData.baggageSize === size.value
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-semibold">{size.label}</div>
                            <div className="text-sm text-gray-600">{size.desc}</div>
                            <div className="text-lg font-bold text-primary-600 mt-2">{size.price}€</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.booking.baggageCount}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={bookingData.baggageCount}
                        onChange={(e) => setBookingData({ ...bookingData, baggageCount: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="inline h-5 w-5 mr-2" />
                        {t.booking.pickupTime}
                      </label>
                      <input
                        type="datetime-local"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={bookingData.pickupTime}
                        onChange={(e) => setBookingData({ ...bookingData, pickupTime: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t.booking.specialInstructions}
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={3}
                        placeholder={t.booking.instructionsPlaceholder}
                        value={bookingData.specialInstructions}
                        onChange={(e) => setBookingData({ ...bookingData, specialInstructions: e.target.value })}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                      >
                        {t.booking.back}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                      >
                        {t.booking.continue}
                      </button>
                    </div>
                  </div>
                )}

                {/* Étape 3: Paiement */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <CreditCard className="inline h-5 w-5 mr-2" />
                        {t.booking.paymentInfo}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
                        placeholder={t.booking.cardNumber}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="MM/AA"
                        />
                        <input
                          type="text"
                          required
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="CVV"
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">
                        {t.booking.securityNote}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                      >
                        {t.booking.back}
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                      >
                        {t.booking.confirmAndPay} {calculatePrice()}€
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Résumé et carte */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.booking.summary}</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.booking.luggage} {bookingData.baggageSize}</span>
                  <span className="font-semibold">{baggagePrices[bookingData.baggageSize]}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.booking.quantity}</span>
                  <span className="font-semibold">x{bookingData.baggageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.booking.serviceFee}</span>
                  <span className="font-semibold">2€</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-lg">{t.booking.total}</span>
                  <span className="font-bold text-2xl text-primary-600">{calculatePrice()}€</span>
                </div>
              </div>

              {/* Carte */}
              <div className="rounded-lg overflow-hidden h-64 mb-4">
                <MapComponent 
                  pickupCoords={bookingData.pickupCoords}
                  deliveryCoords={bookingData.deliveryCoords}
                />
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ {t.booking.insuranceIncluded}</p>
                <p>✓ {t.booking.gpsTracking}</p>
                <p>✓ {t.booking.qrCodeSecure}</p>
                <p>✓ {t.booking.verifiedDrivers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
