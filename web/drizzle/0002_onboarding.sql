CREATE TABLE "user_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"goal" varchar(16) NOT NULL,
	"onboarded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_subjects" (
	"user_id" uuid NOT NULL,
	"subject" varchar(32) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_subjects_user_id_subject_pk" PRIMARY KEY("user_id","subject")
);
