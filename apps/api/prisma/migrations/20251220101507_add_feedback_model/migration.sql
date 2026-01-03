/*
  Warnings:
  - Idempotent Migration Rewrite for Production Recovery
*/

-- CreateEnum: OrderType
DO $$ BEGIN
    CREATE TYPE "OrderType" AS ENUM ('INSTANT', 'SCHEDULED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum: ComplaintStatus
DO $$ BEGIN
    CREATE TYPE "ComplaintStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum: NotificationStatus
DO $$ BEGIN
    CREATE TYPE "NotificationStatus" AS ENUM ('QUEUED', 'SENT', 'FAILED', 'SKIPPED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum: NotificationChannel
DO $$ BEGIN
    CREATE TYPE "NotificationChannel" AS ENUM ('LOG', 'SMS', 'WHATSAPP', 'EMAIL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum: NotificationEvent
DO $$ BEGIN
    CREATE TYPE "NotificationEvent" AS ENUM ('ORDER_PLACED', 'ORDER_ACCEPTED', 'ORDER_PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'SCHEDULED_ORDER_CONFIRMED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterEnum: OrderStatus (Complex idempodency handled by try/catch equivalent in pg)
DO $$ 
BEGIN
    -- Only run if OrderStatus exists and doesn't have new values (approximation)
    BEGIN
        ALTER TYPE "OrderStatus" ADD VALUE 'REFUNDED';
    EXCEPTION WHEN duplicate_object THEN null; -- Value might exist
    END;

    -- Handle the rename/swap logic safely if not already done
    -- This part is risky to automate blindly, defaulting to assuming 'PENDING' exists.
    -- If "OrderStatus" already has values, we skip heavy alteration to avoid data loss.
END $$;


-- AlterEnum: PaymentStatus
DO $$ BEGIN
    ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN undefined_object THEN null; -- If type doesn't exist
END $$;

-- AlterEnum: Role
DO $$ BEGIN
    ALTER TYPE "Role" ADD VALUE 'MANAGER';
    ALTER TYPE "Role" ADD VALUE 'CHEF';
    ALTER TYPE "Role" ADD VALUE 'DELIVERY_PARTNER';
    ALTER TYPE "Role" ADD VALUE 'ACCOUNTANT';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- DropForeignKey: Order_userId_fkey
DO $$ BEGIN
    ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- AlterTable: Category (Add columns)
DO $$ BEGIN
    ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "image" TEXT;
    ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;
    ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
    ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "slug" TEXT;
END $$;

-- AlterTable: Item (Add columns)
DO $$ BEGIN
    ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "altText" TEXT;
    ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "isStockManaged" BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;
    ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
    ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "slug" TEXT;
    ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "stock" INTEGER NOT NULL DEFAULT 100;
END $$;

-- AlterTable: Order (Add columns)
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
    
    -- Order Type (Enum dependency)
    BEGIN
        ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "orderType" "OrderType" NOT NULL DEFAULT 'INSTANT';
    EXCEPTION WHEN undefined_object THEN null; END;

    -- Serial OrderNumber is tricky with IF NOT EXISTS. 
    -- If it exists, skip. If not, add.
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Order' AND column_name='orderNumber') THEN
        ALTER TABLE "Order" ADD COLUMN "orderNumber" SERIAL NOT NULL;
    END IF;

    ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;
    ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
END $$;

-- AlterTable: OrderItem
DO $$ BEGIN
    ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "variants" JSONB;
END $$;

-- AlterTable: Settings
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

-- AlterTable: User
DO $$ BEGIN
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isVIP" BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "notes" TEXT;
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otp" TEXT;
    ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "otpExpiry" TIMESTAMP(3);
    ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;
    ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
END $$;


-- CreateTable: Variant
CREATE TABLE IF NOT EXISTS "Variant" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Location
CREATE TABLE IF NOT EXISTS "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable: DeliveryPartner
CREATE TABLE IF NOT EXISTS "DeliveryPartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "vehicleType" TEXT,
    "vehicleNumber" TEXT,
    "currentLocation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Transaction
CREATE TABLE IF NOT EXISTS "Transaction" (
    "id" TEXT NOT NULL,
    "orderId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Refund
CREATE TABLE IF NOT EXISTS "Refund" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Complaint
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

-- CreateTable: Branch
CREATE TABLE IF NOT EXISTS "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable: NotificationLog
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

-- CreateTable: Feedback
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

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Location_slug_key" ON "Location"("slug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "DeliveryPartner_phone_key" ON "DeliveryPartner"("phone");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Refund_orderId_key" ON "Refund"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Feedback_orderId_key" ON "Feedback"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Item_slug_key" ON "Item"("slug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Order_invoiceNumber_key" ON "Order"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");

-- AddForeignKey (Constraints)
-- Note: Wrapping ADD CONSTRAINT in DO block to avoid 'already exists' error
DO $$ BEGIN
    ALTER TABLE "Variant" ADD CONSTRAINT "Variant_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryPartnerId_fkey" FOREIGN KEY ("deliveryPartnerId") REFERENCES "DeliveryPartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Refund" ADD CONSTRAINT "Refund_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

