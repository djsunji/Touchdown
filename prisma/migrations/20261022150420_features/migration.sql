-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "doctor" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "emergency" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "hotelAddress" TEXT,
ADD COLUMN     "hotelLat" DOUBLE PRECISION,
ADD COLUMN     "hotelLng" DOUBLE PRECISION,
ADD COLUMN     "hotelName" TEXT,
ADD COLUMN     "pharmacy" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Europe/Zurich',
ADD COLUMN     "tipping" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "transferInfo" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "closedDays" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION,
ADD COLUMN     "openFrom" TEXT,
ADD COLUMN     "openUntil" TEXT,
ADD COLUMN     "priceLevel" INTEGER,
ADD COLUMN     "veggie" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "digestEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastDigestAt" TIMESTAMP(3),
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "thumb" BYTEA NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meetup" (
    "id" TEXT NOT NULL,
    "destinationCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "place" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Meetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetupAttendee" (
    "meetupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeetupAttendee_pkey" PRIMARY KEY ("meetupId","userId")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "note" TEXT,
    "reporterId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nightstop" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "destinationCode" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Nightstop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Photo_entryId_createdAt_idx" ON "Photo"("entryId", "createdAt");

-- CreateIndex
CREATE INDEX "Meetup_destinationCode_startsAt_idx" ON "Meetup"("destinationCode", "startsAt");

-- CreateIndex
CREATE INDEX "Report_status_createdAt_idx" ON "Report"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Report_targetType_targetId_reporterId_key" ON "Report"("targetType", "targetId", "reporterId");

-- CreateIndex
CREATE INDEX "Nightstop_date_idx" ON "Nightstop"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Nightstop_userId_destinationCode_date_key" ON "Nightstop"("userId", "destinationCode", "date");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meetup" ADD CONSTRAINT "Meetup_destinationCode_fkey" FOREIGN KEY ("destinationCode") REFERENCES "Destination"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meetup" ADD CONSTRAINT "Meetup_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetupAttendee" ADD CONSTRAINT "MeetupAttendee_meetupId_fkey" FOREIGN KEY ("meetupId") REFERENCES "Meetup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetupAttendee" ADD CONSTRAINT "MeetupAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nightstop" ADD CONSTRAINT "Nightstop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nightstop" ADD CONSTRAINT "Nightstop_destinationCode_fkey" FOREIGN KEY ("destinationCode") REFERENCES "Destination"("code") ON DELETE CASCADE ON UPDATE CASCADE;
