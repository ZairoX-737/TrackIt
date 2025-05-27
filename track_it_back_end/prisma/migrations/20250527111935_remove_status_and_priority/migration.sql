/*
  Warnings:

  - You are about to drop the column `priority` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "priority",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "Priority";
