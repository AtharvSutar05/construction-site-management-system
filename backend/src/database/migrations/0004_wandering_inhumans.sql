CREATE TYPE "public"."suggested_status" AS ENUM('open', 'in_progress', 'pending', 'completed');--> statement-breakpoint
CREATE TABLE "task_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"suggestedStatus" "suggested_status" NOT NULL,
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "task_progress_report_task_unique" UNIQUE("report_id","task_id")
);
--> statement-breakpoint
ALTER TABLE "daily_reports" DROP CONSTRAINT "daily_reports_submission_check";--> statement-breakpoint
ALTER TABLE "task_progress" ADD CONSTRAINT "task_progress_report_id_daily_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."daily_reports"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "task_progress" ADD CONSTRAINT "task_progress_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "task_progress_report_idx" ON "task_progress" USING btree ("report_id");--> statement-breakpoint
CREATE INDEX "task_progress_task_idx" ON "task_progress" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "task_progress_status_idx" ON "task_progress" USING btree ("suggestedStatus");--> statement-breakpoint
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_submission_check" CHECK (
                (
                    status = 'draft'
                    AND submitted_at IS NULL
                )
                OR
                (
                    status <> 'draft'
                    AND submitted_at IS NOT NULL
                )
            );