CREATE TYPE "public"."site_status" AS ENUM('active', 'on_hold', 'completed', 'archived');--> statement-breakpoint
CREATE TABLE "sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"companyId" uuid NOT NULL,
	"name" varchar(150) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"status" "site_status" DEFAULT 'active' NOT NULL,
	"createdBy" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "company_site_code_unique" UNIQUE("companyId","code")
);
--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sites_company_idx" ON "sites" USING btree ("companyId");