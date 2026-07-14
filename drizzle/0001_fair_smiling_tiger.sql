CREATE TABLE "page_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path" text NOT NULL,
	"ip_hash" text,
	"user_agent" text,
	"device_type" text DEFAULT 'desktop' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
