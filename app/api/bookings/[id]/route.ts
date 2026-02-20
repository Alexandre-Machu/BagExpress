import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const booking = await prisma.booking.findUnique({
      where: { id },
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
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const id = params.id
    
    const updateData: any = {}
    
    if (data.status) {
      updateData.status = data.status
      
      // Mettre à jour les timestamps selon le statut
      if (data.status === 'ACCEPTED') {
        updateData.acceptedAt = new Date()
      } else if (data.status === 'PICKED_UP') {
        updateData.pickedUpAt = new Date()
      } else if (data.status === 'DELIVERED') {
        updateData.deliveredAt = new Date()
      }
    }
    
    if (data.driverId) {
      updateData.driverId = data.driverId
    }
    
    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        driver: {
          include: {
            user: true,
          },
        },
      },
    })
    
    return NextResponse.json({ 
      success: true,
      booking
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update booking' 
    }, { status: 400 })
  }
}
