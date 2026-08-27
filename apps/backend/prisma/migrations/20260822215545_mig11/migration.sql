/*
  Warnings:

  - You are about to drop the column `clubAdminId` on the `Club` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_clubAdminId_fkey";

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "clubAdminId";
