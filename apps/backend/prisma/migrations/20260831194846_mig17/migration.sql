-- DropForeignKey
ALTER TABLE "ClubEvent" DROP CONSTRAINT "ClubEvent_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubJoinRequest" DROP CONSTRAINT "ClubJoinRequest_profileId_fkey";

-- AddForeignKey
ALTER TABLE "ClubJoinRequest" ADD CONSTRAINT "ClubJoinRequest_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubEvent" ADD CONSTRAINT "ClubEvent_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
