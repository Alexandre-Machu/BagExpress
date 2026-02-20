import { NextResponse } from 'next/server'

// Types
interface Driver {
  id: string
  name: string
  phone: string
  vehicleType: string
  rating: number
  totalDeliveries: number
  earnings: number
}

// Stockage temporaire en mémoire
let drivers: Driver[] = []

// GET - Récupérer tous les chauffeurs
export async function GET() {
  return NextResponse.json({ drivers })
}

// POST - Enregistrer un nouveau chauffeur
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const newDriver: Driver = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      rating: 5.0,
      totalDeliveries: 0,
      earnings: 0,
    }
    
    drivers.push(newDriver)
    
    return NextResponse.json({ 
      success: true, 
      driver: newDriver 
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid request data' 
    }, { status: 400 })
  }
}
