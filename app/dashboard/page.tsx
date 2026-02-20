'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, MapPin, Clock, User, Phone, CheckCircle, 
  XCircle, Loader, ArrowRight, Calendar 
} from 'lucide-react';

interface Booking {
  id: string;
  pickupLocation: string;
  deliveryLocation: string;
  baggageSize: string;
  baggageCount: number;
  pickupTime: string;
  price: number;
  status: string;
  createdAt: string;
  driver?: {
    user: {
      name: string;
      phone: string;
    };
  };
}

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchBookings();
    }
  }, [session]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      // Filtrer les réservations du client connecté
      const userBookings = data.bookings?.filter(
        (booking: any) => booking.customerId === session?.user.id
      ) || [];
      setBookings(userBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800';
      case 'PICKED_UP':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'ACCEPTED':
        return 'Acceptée';
      case 'PICKED_UP':
        return 'Récupérée';
      case 'DELIVERED':
        return 'Livrée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  const activeBookings = bookings.filter(
    (b) => b.status !== 'DELIVERED' && b.status !== 'CANCELLED'
  );
  const historyBookings = bookings.filter(
    (b) => b.status === 'DELIVERED' || b.status === 'CANCELLED'
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">BagExpress</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Bienvenue, {session?.user?.name}</span>
            <Link
              href="/book"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Nouvelle réservation
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes réservations</h1>
          <p className="text-gray-600 mt-2">Suivez vos livraisons de bagages en temps réel</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'active'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                En cours ({activeBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'history'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Historique ({historyBookings.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {(activeTab === 'active' ? activeBookings : historyBookings).length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab === 'active' ? 'Aucune réservation en cours' : 'Aucun historique'}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'active' 
                  ? 'Créez votre première réservation pour commencer'
                  : 'Vos réservations terminées apparaîtront ici'}
              </p>
              {activeTab === 'active' && (
                <Link
                  href="/book"
                  className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                >
                  Réserver maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              )}
            </div>
          ) : (
            (activeTab === 'active' ? activeBookings : historyBookings).map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{booking.price}€</div>
                    <div className="text-sm text-gray-500">
                      {booking.baggageCount} bagage{booking.baggageCount > 1 ? 's' : ''} ({booking.baggageSize})
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Pickup */}
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Récupération</div>
                      <div className="font-medium text-gray-900">{booking.pickupLocation}</div>
                      <div className="text-sm text-gray-600 flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(booking.pickupTime).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  {/* Line */}
                  <div className="ml-1.5 w-0.5 h-8 bg-gray-300"></div>

                  {/* Delivery */}
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Livraison</div>
                      <div className="font-medium text-gray-900">{booking.deliveryLocation}</div>
                    </div>
                  </div>
                </div>

                {/* Driver Info */}
                {booking.driver && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Chauffeur</div>
                        <div className="font-medium text-gray-900">{booking.driver.user.name}</div>
                      </div>
                      <Phone className="w-5 h-5 text-gray-400 ml-auto" />
                      <div className="text-sm text-gray-900">{booking.driver.user.phone}</div>
                    </div>
                  </div>
                )}

                {/* Booking Date */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Réservé le {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
