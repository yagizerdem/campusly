/*
  Warnings:

  - A unique constraint covering the columns `[profileId,clubId]` on the table `ClubMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ClubMemberRole" AS ENUM ('MEMBER', 'ADMIN', 'MANAGER');

-- AlterTable
ALTER TABLE "ClubMember" ADD COLUMN     "role" "ClubMemberRole" NOT NULL DEFAULT 'MEMBER',
ADD COLUMN     "roleDescription" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ClubMember_profileId_clubId_key" ON "ClubMember"("profileId", "clubId");
