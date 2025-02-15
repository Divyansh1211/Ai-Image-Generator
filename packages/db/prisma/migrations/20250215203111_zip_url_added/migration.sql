/*
  Warnings:

  - You are about to drop the `TainingImages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `zipUrl` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TainingImages" DROP CONSTRAINT "TainingImages_modelId_fkey";

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "zipUrl" TEXT NOT NULL;

-- DropTable
DROP TABLE "TainingImages";
