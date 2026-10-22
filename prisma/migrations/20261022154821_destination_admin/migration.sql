-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "landmark" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "AppSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("key")
);
