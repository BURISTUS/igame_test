/*
  Warnings:

  - Added the required column `isWin` to the `IGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IGame" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isWin" BOOLEAN NOT NULL;
