/*
  Warnings:

  - Added the required column `location` to the `ClubEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClubEvent" ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "locationUrl" TEXT;
