CREATE TABLE "user_competitions" (
	"user_id" uuid NOT NULL,
	"competition" varchar(48) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_competitions_user_id_competition_pk" PRIMARY KEY("user_id","competition")
);
--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "goal" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "role" varchar(16);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "grade" smallint;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "institution" varchar(16);--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "course" smallint;