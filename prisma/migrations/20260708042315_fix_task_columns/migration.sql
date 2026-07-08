ALTER TABLE "tasks" RENAME COLUMN "isTaskDoneStatus" TO "completed";

ALTER TABLE "tasks" DROP CONSTRAINT "UQ_396d500ff7f1b82771ddd812fd1";

ALTER TABLE "tasks" ADD CONSTRAINT "tasks_name_userId_key" UNIQUE ("name", "userId");