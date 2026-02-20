// Types
export interface Booking {
  id: string
  pickupLocation: string
  deliveryLocation: string
  pickupCoords: [number, number]
  deliveryCoords: [number, number]
  baggageSize: 'small' | 'medium' | 'large' | 'xlarge'
  baggageCount: number
  pickupTime: string
  price: number
  status: 'pending' | 'accepted' | 'picked-up' | 'delivered' | 'cancelled'
  customerName: string
  customerPhone: string
  specialInstructions?: string
  createdAt: string
  updatedAt?: string
}

export interface Driver {
  id: string
  name: string
  email: string
  phone: string
  vehicleType: 'bike' | 'electric-bike' | 'scooter' | 'car'
  vehicleModel: string
  licensePlate: string
  rating: number
  totalDeliveries: number
  earnings: number
  isVerified: boolean
  isOnline: boolean
  currentLocation?: [number, number]
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
  bookings: string[] // IDs des réservations
}

// Constantes
export const BAGGAGE_PRICES = {
  small: 8,
  medium: 12,
  large: 18,
  xlarge: 25,
}

export const SERVICE_FEE = 2
export const COMMISSION_RATE = 0.2 // 20% de commission pour la plateforme

// Helper functions
export const calculateTotalPrice = (baggageSize: Booking['baggageSize'], baggageCount: number): number => {
  return BAGGAGE_PRICES[baggageSize] * baggageCount + SERVICE_FEE
}

export const calculateDriverEarnings = (bookingPrice: number): number => {
  return bookingPrice * (1 - COMMISSION_RATE)
}

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
