CREATE TYPE "public"."issue_type" AS ENUM('client', 'design', 'labour', 'machine', 'material', 'safety', 'weather', 'other');--> statement-breakpoint
CREATE TABLE "issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_progress_id" uuid NOT NULL,
	"type" "issue_type" NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "issues_task_progress_unique" UNIQUE("task_progress_id")
);
--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_task_progress_id_task_progress_id_fk" FOREIGN KEY ("task_progress_id") REFERENCES "public"."task_progress"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "issues_type_idx" ON "issues" USING btree ("type");