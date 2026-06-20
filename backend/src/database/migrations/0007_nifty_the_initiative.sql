CREATE TYPE "public"."approval_status" AS ENUM('approved', 'rejected');--> statement-breakpoint
CREATE TABLE "report_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"reviewed_by" uuid NOT NULL,
	"status" "approval_status" NOT NULL,
	"remarks" text,
	"reviewed_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "report_approvals_report_unique" UNIQUE("report_id")
);
--> statement-breakpoint
ALTER TABLE "report_approvals" ADD CONSTRAINT "report_approvals_report_id_daily_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."daily_reports"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_approvals" ADD CONSTRAINT "report_approvals_reviewed_by_company_members_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."company_members"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "report_approvals_reviewed_by_idx" ON "report_approvals" USING btree ("reviewed_by");--> statement-breakpoint
CREATE INDEX "report_approvals_status_idx" ON "report_approvals" USING btree ("status");