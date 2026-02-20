import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer toutes les réservations
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        driver: {
          include: {
            user: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle réservation
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Pour l'instant, créer un utilisateur temporaire si customerId n'existe pas
    let customerId = data.customerId
    
    if (!customerId) {
      // Créer un utilisateur temporaire
      const tempUser = await prisma.user.create({
        data: {
          email: `temp_${Date.now()}@bagexpress.com`,
          name: data.customerName,
          password: 'temp', // À remplacer avec un vrai système d'auth
          phone: data.customerPhone,
          role: 'CLIENT',
        },
      })
      customerId = tempUser.id
    }
    
    const booking = await prisma.booking.create({
      data: {
        customerId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        pickupLocation: data.pickupLocation,
        pickupLatitude: data.pickupCoords[0],
        pickupLongitude: data.pickupCoords[1],
        deliveryLocation: data.deliveryLocation,
        deliveryLatitude: data.deliveryCoords[0],
        deliveryLongitude: data.deliveryCoords[1],
        baggageSize: data.baggageSize.toUpperCase(),
        baggageCount: data.baggageCount,
        pickupTime: new Date(data.pickupTime),
        price: data.price,
        commission: data.price * 0.2,
        driverEarnings: data.price * 0.8,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
    
    return NextResponse.json({ 
      success: true, 
      booking 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create booking' 
    }, { status: 400 })
  }
}
