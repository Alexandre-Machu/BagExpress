-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'DRIVER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ACCEPTED', 'PICKED_UP', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BaggageSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'XLARGE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "totalDeliveries" INTEGER NOT NULL DEFAULT 0,
    "earnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "driverId" TEXT,
    "pickupLocation" TEXT NOT NULL,
    "pickupLatitude" DOUBLE PRECISION NOT NULL,
    "pickupLongitude" DOUBLE PRECISION NOT NULL,
    "deliveryLocation" TEXT NOT NULL,
    "deliveryLatitude" DOUBLE PRECISION NOT NULL,
    "deliveryLongitude" DOUBLE PRECISION NOT NULL,
    "baggageSize" "BaggageSize" NOT NULL,
    "baggageCount" INTEGER NOT NULL,
    "specialInstructions" TEXT,
    "pickupTime" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "pickedUpAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "price" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "driverEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "qrCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "stripePaymentId" TEXT,
    "stripeClientSecret" TEXT,
    "refundAmount" DOUBLE PRECISION,
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_userId_key" ON "Driver"("userId");

-- CreateIndex
CREATE INDEX "Driver_userId_idx" ON "Driver"("userId");

-- CreateIndex
CREATE INDEX "Driver_isOnline_idx" ON "Driver"("isOnline");

-- CreateIndex
CREATE INDEX "Booking_customerId_idx" ON "Booking"("customerId");

-- CreateIndex
CREATE INDEX "Booking_driverId_idx" ON "Booking"("driverId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_pickupTime_idx" ON "Booking"("pickupTime");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE INDEX "Payment_bookingId_idx" ON "Payment"("bookingId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
