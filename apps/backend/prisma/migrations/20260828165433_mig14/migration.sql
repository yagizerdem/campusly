/*
  Warnings:

  - Added the required column `objectKey` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "objectKey" TEXT NOT NULL,
ADD COLUMN     "sizeInBytes" INTEGER;
