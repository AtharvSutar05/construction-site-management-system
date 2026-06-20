CREATE TYPE "public"."report_status" AS ENUM('draft', 'submitted', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "daily_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"report_date" date NOT NULL,
	"weather" varchar(100) NOT NULL,
	"manpower" integer NOT NULL,
	"remarks" text,
	"status" "report_status" DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "daily_reports_site_engineer_date_unique" UNIQUE("site_id","created_by","report_date"),
	CONSTRAINT "daily_reports_manpower_check" CHECK ("daily_reports"."manpower" >= 0),
	CONSTRAINT "daily_reports_submission_check" CHECK (
                (
                    status = 'draft'
                    AND submitted_at IS NULL
                )
                OR
                (
                    status <> 'draft'
                    AND submitted_at IS NOT NULL
                )
            )
);
--> statement-breakpoint
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "daily_reports" ADD CONSTRAINT "daily_reports_created_by_company_members_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."company_members"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "daily_reports_site_idx" ON "daily_reports" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "daily_reports_created_by_idx" ON "daily_reports" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "daily_reports_status_idx" ON "daily_reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "daily_reports_report_date_idx" ON "daily_reports" USING btree ("report_date");--> statement-breakpoint
CREATE INDEX "daily_reports_site_date_idx" ON "daily_reports" USING btree ("site_id","report_date");