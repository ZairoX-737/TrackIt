/*
  Warnings:

  - Added the required column `project_id` to the `label` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "label" ADD COLUMN     "project_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "label" ADD CONSTRAINT "label_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
