CREATE TABLE "proof_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_progress_id" uuid NOT NULL,
	"imageUrl" text NOT NULL,
	"caption" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "proof_photos" ADD CONSTRAINT "proof_photos_task_progress_id_task_progress_id_fk" FOREIGN KEY ("task_progress_id") REFERENCES "public"."task_progress"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "proof_photos_task_progress_idx" ON "proof_photos" USING btree ("task_progress_id");