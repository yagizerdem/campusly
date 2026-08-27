-- CreateTable
CREATE TABLE "StoryImage" (
    "storyId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StoryImage_pkey" PRIMARY KEY ("storyId","imageId")
);

-- CreateTable
CREATE TABLE "Stories" (
    "id" TEXT NOT NULL,
    "storyTitle" TEXT NOT NULL,
    "storyContent" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubEvent" (
    "id" TEXT NOT NULL,
    "eventTitle" TEXT NOT NULL,
    "eventDescription" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "clubId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubEventImage" (
    "clubEventId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ClubEventImage_pkey" PRIMARY KEY ("clubEventId","imageId")
);

-- CreateTable
CREATE TABLE "ClubEventForm" (
    "id" TEXT NOT NULL,
    "formJson" JSONB NOT NULL,
    "clubEventId" TEXT NOT NULL,
    "surveySchemaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubEventForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveySchemas" (
    "id" TEXT NOT NULL,
    "schemaJson" JSONB NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveySchemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveySchemaResponses" (
    "id" TEXT NOT NULL,
    "responseJson" JSONB NOT NULL,
    "surveySchemaId" TEXT NOT NULL,
    "respondentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveySchemaResponses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClubEventForm_clubEventId_key" ON "ClubEventForm"("clubEventId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubEventForm_surveySchemaId_key" ON "ClubEventForm"("surveySchemaId");

-- AddForeignKey
ALTER TABLE "StoryImage" ADD CONSTRAINT "StoryImage_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryImage" ADD CONSTRAINT "StoryImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stories" ADD CONSTRAINT "Stories_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stories" ADD CONSTRAINT "Stories_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubEvent" ADD CONSTRAINT "ClubEvent_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubEventImage" ADD CONSTRAINT "ClubEventImage_clubEventId_fkey" FOREIGN KEY ("clubEventId") REFERENCES "ClubEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubEventImage" ADD CONSTRAINT "ClubEventImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubEventForm" ADD CONSTRAINT "ClubEventForm_clubEventId_fkey" FOREIGN KEY ("clubEventId") REFERENCES "ClubEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubEventForm" ADD CONSTRAINT "ClubEventForm_surveySchemaId_fkey" FOREIGN KEY ("surveySchemaId") REFERENCES "SurveySchemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveySchemas" ADD CONSTRAINT "SurveySchemas_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveySchemaResponses" ADD CONSTRAINT "SurveySchemaResponses_surveySchemaId_fkey" FOREIGN KEY ("surveySchemaId") REFERENCES "SurveySchemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveySchemaResponses" ADD CONSTRAINT "SurveySchemaResponses_respondentId_fkey" FOREIGN KEY ("respondentId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
