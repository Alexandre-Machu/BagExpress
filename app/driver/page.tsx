'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Backpack, MapPin, Package, Clock, CheckCircle, XCircle, Navigation, QrCode, Loader } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSelector from '@/components/LanguageSelector'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const MapComponent = dynamic(() => import('@/components/Map'), { ssr: false })

interface Delivery {
  id: string
  pickupLocation: string
  deliveryLocation: string
  pickupLatitude: number
  pickupLongitude: number
  deliveryLatitude: number
  deliveryLongitude: number
  baggageSize: string
  baggageCount: number
  pickupTime: string
  price: number
  status: string
  customerName: string
  customerPhone: string
  driverId: string | null
}

export default function DriverPage() {
  const { t } = useLanguage()
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user.role !== 'DRIVER') {
      router.push('/')
    }
  }, [session, sessionStatus, router])

  useEffect(() => {
    if (session) {
      fetchDeliveries()
    }
  }, [session])

  const fetchDeliveries = async () => {
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()
      setDeliveries(data.bookings || [])
    } catch (error) {
      console.error('Error fetching deliveries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptDelivery = async (deliveryId: string) => {
    try {
      const response = await fetch(`/api/bookings/${deliveryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'ACCEPTED',
          driverId: session?.user.driverId,
        }),
      })

      if (response.ok) {
        fetchDeliveries()
        const delivery = deliveries.find(d => d.id === deliveryId)
        if (delivery) {
          setSelectedDelivery({ ...delivery, status: 'ACCEPTED' })
        }
      }
    } catch (error) {
      console.error('Error accepting delivery:', error)
    }
  }

  const handlePickup = async () => {
    if (!selectedDelivery) return

    try {
      const response = await fetch(`/api/bookings/${selectedDelivery.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'PICKED_UP',
        }),
      })

      if (response.ok) {
        fetchDeliveries()
        setSelectedDelivery({ ...selectedDelivery, status: 'PICKED_UP' })
        setShowQRScanner(false)
      }
    } catch (error) {
      console.error('Error updating pickup:', error)
    }
  }

  const handleDelivery = async () => {
    if (!selectedDelivery) return

    try {
      const response = await fetch(`/api/bookings/${selectedDelivery.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'DELIVERED',
        }),
      })

      if (response.ok) {
        fetchDeliveries()
        setShowQRScanner(false)
        alert(`Livraison complétée ! Vous avez gagné ${selectedDelivery.price}€`)
        setSelectedDelivery(null)
      }
    } catch (error) {
      console.error('Error updating delivery:', error)
    }
  }

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const filteredDeliveries = deliveries.filter(d => {
    if (activeTab === 'available') return d.status === 'PENDING'
    if (activeTab === 'active') return (d.status === 'ACCEPTED' || d.status === 'PICKED_UP') && d.driverId === session?.user.driverId
    if (activeTab === 'completed') return d.status === 'DELIVERED' && d.driverId === session?.user.driverId
    return false
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Backpack className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">{t.driver.title}</span>
          </Link>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <div className="text-right">
              <div className="text-sm text-gray-600">{t.driver.dailyEarnings}</div>
              <div className="text-xl font-bold text-primary-600">
                {deliveries.filter(d => d.status === 'delivered').reduce((sum, d) => sum + d.price, 0)}€
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 py-4 text-center font-semibold transition ${
                activeTab === 'available'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.driver.available} ({deliveries.filter(d => d.status === 'available').length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-4 text-center font-semibold transition ${
                activeTab === 'active'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.driver.active} ({deliveries.filter(d => d.status === 'accepted' || d.status === 'picked-up').length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-4 text-center font-semibold transition ${
                activeTab === 'completed'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.driver.completed} ({deliveries.filter(d => d.status === 'delivered').length})
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Liste des livraisons */}
          <div className="lg:col-span-2 space-y-4">
            {filteredDeliveries.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">{t.driver.noDeliveries} {activeTab === 'available' ? t.driver.available.toLowerCase() : activeTab === 'active' ? t.driver.active.toLowerCase() : t.driver.completed.toLowerCase()}</p>
              </div>
            ) : (
              filteredDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition hover:shadow-md ${
                    selectedDelivery?.id === delivery.id ? 'ring-2 ring-primary-600' : ''
                  }`}
                  onClick={() => setSelectedDelivery(delivery)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          delivery.status === 'available' ? 'bg-green-100 text-green-800' :
                          delivery.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          delivery.status === 'picked-up' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {delivery.status === 'available' ? t.driver.available :
                           delivery.status === 'accepted' ? 'Accepted' :
                           delivery.status === 'picked-up' ? 'Picked up' :
                           'Delivered'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{delivery.customerName}</h3>
                      <p className="text-sm text-gray-600">{delivery.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">{delivery.price}€</div>
                      <div className="text-sm text-gray-600">{delivery.baggageCount} bagage(s)</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-600">{t.driver.pickupAt}</div>
                        <div className="font-medium">{delivery.pickupLocation}</div>
                        <div className="text-sm text-gray-600">{new Date(delivery.pickupTime).toLocaleString('fr-FR')}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-600">{t.driver.deliveryAt}</div>
                        <div className="font-medium">{delivery.deliveryLocation}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="h-4 w-4 mr-1" />
                    Bagage {delivery.baggageSize} × {delivery.baggageCount}
                  </div>

                  {delivery.status === 'available' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAcceptDelivery(delivery.id)
                      }}
                      className="w-full mt-4 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                    >
                      {t.driver.acceptRide}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Détails et carte */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              {selectedDelivery ? (
                <div>
                  <h3 className="text-xl font-bold mb-4">{t.driver.rideDetails}</h3>
                  
                  {/* Carte */}
                  <div className="rounded-lg overflow-hidden h-64 mb-4">
                    <MapComponent 
                      pickupCoords={[selectedDelivery.pickupLatitude, selectedDelivery.pickupLongitude]}
                      deliveryCoords={[selectedDelivery.deliveryLatitude, selectedDelivery.deliveryLongitude]}
                    />
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {selectedDelivery.status === 'accepted' && (
                      <>
                        <button
                          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedDelivery.pickupLatitude},${selectedDelivery.pickupLongitude}`, '_blank')}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center"
                        >
                          <Navigation className="h-5 w-5 mr-2" />
                          {t.driver.navigationToPickup}
                        </button>
                        <button
                          onClick={() => setShowQRScanner(true)}
                          className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold flex items-center justify-center"
                        >
                          <QrCode className="h-5 w-5 mr-2" />
                          {t.driver.scanQRPickup}
                        </button>
                      </>
                    )}

                    {selectedDelivery.status === 'picked-up' && (
                      <>
                        <button
                          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedDelivery.deliveryLatitude},${selectedDelivery.deliveryLongitude}`, '_blank')}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center"
                        >
                          <Navigation className="h-5 w-5 mr-2" />
                          {t.driver.navigationToDelivery}
                        </button>
                        <button
                          onClick={() => setShowQRScanner(true)}
                          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center"
                        >
                          <QrCode className="h-5 w-5 mr-2" />
                          {t.driver.scanQRDelivery}
                        </button>
                      </>
                    )}

                    {selectedDelivery.status === 'delivered' && (
                      <div className="text-center py-8">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-gray-900">{t.driver.deliveryCompleted}</p>
                        <p className="text-gray-600 mt-2">+{selectedDelivery.price}€</p>
                      </div>
                    )}
                  </div>

                  {/* Info client */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-2">{t.driver.customerContact}</h4>
                    <p className="text-sm text-gray-600 mb-1">{selectedDelivery.customerName}</p>
                    <a href={`tel:${selectedDelivery.customerPhone}`} className="text-sm text-primary-600 hover:underline">
                      {selectedDelivery.customerPhone}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">{t.driver.selectDelivery}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal QR Scanner */}
      {showQRScanner && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">{t.driver.scanQRCode}</h3>
            <div className="bg-gray-100 rounded-lg p-8 mb-6 flex items-center justify-center h-64">
              <QrCode className="h-32 w-32 text-gray-400" />
            </div>
            <p className="text-center text-gray-600 mb-6">
              {selectedDelivery.status === 'accepted' 
                ? t.driver.scanQRPickupDesc
                : t.driver.scanQRDeliveryDesc}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowQRScanner(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                {t.driver.cancel}
              </button>
              <button
                onClick={selectedDelivery.status === 'accepted' ? handlePickup : handleDelivery}
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                {t.driver.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
