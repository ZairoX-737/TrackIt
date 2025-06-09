/*
  Warnings:

  - Added the required column `project_id` to the `notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TASK_CREATED', 'TASK_UPDATED', 'TASK_DELETED', 'COMMENT_CREATED', 'BOARD_CREATED', 'BOARD_UPDATED', 'BOARD_DELETED', 'COLUMN_CREATED', 'COLUMN_UPDATED', 'COLUMN_DELETED', 'USER_JOINED_PROJECT', 'USER_LEFT_PROJECT', 'LABEL_CREATED', 'LABEL_UPDATED', 'LABEL_DELETED');

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "entity_id" TEXT,
ADD COLUMN     "entity_type" TEXT,
ADD COLUMN     "project_id" TEXT NOT NULL,
ADD COLUMN     "triggered_by" TEXT,
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_triggered_by_fkey" FOREIGN KEY ("triggered_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
