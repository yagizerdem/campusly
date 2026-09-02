-- AlterEnum
ALTER TYPE "JoinRequestStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "requiresJoinRequest" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "email" TEXT;
