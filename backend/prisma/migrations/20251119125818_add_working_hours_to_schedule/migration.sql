-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "endTime" TEXT NOT NULL DEFAULT '17:00',
ADD COLUMN     "startTime" TEXT NOT NULL DEFAULT '09:00';
