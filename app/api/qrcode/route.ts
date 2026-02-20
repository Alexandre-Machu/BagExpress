import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json()
    
    // Générer le QR code
    const qrCodeData = JSON.stringify({
      bookingId,
      timestamp: Date.now(),
      type: 'baggage-delivery',
    })
    
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData)
    
    return NextResponse.json({ 
      success: true,
      qrCode: qrCodeUrl
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate QR code' 
    }, { status: 500 })
  }
}
