import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Hasher les mots de passe
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Créer un client
    const client = await prisma.user.create({
      data: {
        email: 'client@test.com',
        password: hashedPassword,
        name: 'John Client',
        phone: '+33 6 12 34 56 78',
        role: 'CLIENT',
        emailVerified: true,
      },
    });

    console.log('✅ Client créé:', client.email);

    // Créer un chauffeur
    const driverUser = await prisma.user.create({
      data: {
        email: 'driver@test.com',
        password: hashedPassword,
        name: 'Marc Driver',
        phone: '+33 6 98 76 54 32',
        role: 'DRIVER',
        emailVerified: true,
        driver: {
          create: {
            vehicleType: 'electric-bike',
            vehicleModel: 'Rad Power Bike',
            licensePlate: 'EB-123',
            isVerified: true,
            isOnline: true,
            latitude: 48.8566,
            longitude: 2.3522,
          },
        },
      },
      include: {
        driver: true,
      },
    });

    console.log('✅ Chauffeur créé:', driverUser.email);

    console.log('\n📋 Comptes de test créés:');
    console.log('Client: client@test.com / password123');
    console.log('Chauffeur: driver@test.com / password123');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
