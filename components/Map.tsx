'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix pour les icônes Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface MapComponentProps {
  pickupCoords: [number, number]
  deliveryCoords: [number, number]
  driverCoords?: [number, number]
  showRoute?: boolean
}

export default function MapComponent({ 
  pickupCoords, 
  deliveryCoords, 
  driverCoords,
  showRoute = true 
}: MapComponentProps) {
  return (
    <MapContainer
      center={pickupCoords}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Marqueur récupération */}
      <Marker position={pickupCoords} icon={icon}>
        <Popup>Point de récupération</Popup>
      </Marker>
      
      {/* Marqueur livraison */}
      <Marker position={deliveryCoords} icon={icon}>
        <Popup>Point de livraison</Popup>
      </Marker>
      
      {/* Marqueur chauffeur (si disponible) */}
      {driverCoords && (
        <Marker position={driverCoords} icon={icon}>
          <Popup>Chauffeur</Popup>
        </Marker>
      )}
      
      {/* Ligne de trajet */}
      {showRoute && (
        <Polyline
          positions={[pickupCoords, deliveryCoords]}
          color="#0ea5e9"
          weight={3}
          opacity={0.7}
        />
      )}
    </MapContainer>
  )
}
