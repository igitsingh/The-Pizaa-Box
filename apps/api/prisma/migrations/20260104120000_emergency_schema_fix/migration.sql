/*
  PROPER FIXED MIGRATION FOR SCHEMA DRIFT
  This migration assumes the DB might be in any state (partially applied, missing columns).
  It uses IF NOT EXISTS for everything.
*/

-- 1. ENUMS (Safe Creation)
DO $$ BEGIN
    CREATE TYPE "OrderType" AS ENUM ('INSTANT', 'SCHEDULED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "ComplaintStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "NotificationStatus" AS ENUM ('QUEUED', 'SENT', 'FAILED', 'SKIPPED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "NotificationChannel" AS ENUM ('LOG', 'SMS', 'WHATSAPP', 'EMAIL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE "NotificationEvent" AS ENUM ('ORDER_PLACED', 'ORDER_ACCEPTED', 'ORDER_PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'SCHEDULED_ORDER_CONFIRMED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABLE: User (Add missing cols)
DO $$ BEGIN
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otp" TEXT;
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otpExpiry" TIMESTAMP(3);
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isVIP" BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "notes" TEXT;
END $$;

-- 3. TABLE: Order (Add missing cols)
DO $$ BEGIN
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "addressId" TEXT;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "couponCode" TEXT;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerName" TEXT;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerPhone" TEXT;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "deliveryPartnerId" TEXT;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "guestAddress" JSONB;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "instructions" TEXT;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "invoiceGeneratedAt" TIMESTAMP(3);
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "invoiceNumber" TEXT;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "isRepeated" BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "repeatedFromOrderId" TEXT;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "scheduledFor" TIMESTAMP(3);
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "tax" DOUBLE PRECISION NOT NULL DEFAULT 0;
    ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "taxBreakup" JSONB;
    
    -- Ensure status has default PENDING
    ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
    
    -- OrderType Enum Column
    BEGIN
        ALTER TABLE "Order" ADD COLUMN "orderType" "OrderType" NOT NULL DEFAULT 'INSTANT';
    EXCEPTION WHEN duplicate_column THEN null; END;

    -- OrderNumber Serial (Complex)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Order' AND column_name='orderNumber') THEN
        ALTER TABLE "Order" ADD COLUMN "orderNumber" SERIAL NOT NULL;
    END IF;
END $$;

-- 4. TABLE: Settings (Add missing cols)
DO $$ BEGIN
    ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "closedMessage" TEXT;
    ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "emailEnabled" BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "isPaused" BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;
    ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "seoOgImage" TEXT;
    ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
    ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "smsEnabled" BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false;
END $$;

-- 5. CREATE MISSING TABLES IF NOT EXISTS

CREATE TABLE IF NOT EXISTS "Feedback" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT,
    "guestPhone" TEXT,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "adminResponse" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Complaint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "NotificationLog" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "event" "NotificationEvent" NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Variant" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- 6. Add Indexes (Safe)
CREATE UNIQUE INDEX IF NOT EXISTS "Feedback_orderId_key" ON "Feedback"("orderId");
CREATE UNIQUE INDEX IF NOT EXISTS "Order_invoiceNumber_key" ON "Order"("invoiceNumber");

-- 7. Add Foreign Keys (Safe)
DO $$ BEGIN
    ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
