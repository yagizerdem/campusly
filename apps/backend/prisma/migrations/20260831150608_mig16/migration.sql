-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_clubId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "clubId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
