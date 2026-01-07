/*
  Warnings:

  - Made the column `content` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;
