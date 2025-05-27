-- DropForeignKey
ALTER TABLE "label_on_task" DROP CONSTRAINT "label_on_task_label_id_fkey";

-- AddForeignKey
ALTER TABLE "label_on_task" ADD CONSTRAINT "label_on_task_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "label"("id") ON DELETE CASCADE ON UPDATE CASCADE;
