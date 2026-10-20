CREATE TABLE "attempt_answers" (
	"attempt_id" integer NOT NULL,
	"position" smallint NOT NULL,
	"question_id" integer NOT NULL,
	"chosen_index" smallint,
	"is_correct" boolean,
	"answered_at" timestamp with time zone,
	CONSTRAINT "attempt_answers_attempt_id_position_pk" PRIMARY KEY("attempt_id","position")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "questions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"subject" varchar(32) NOT NULL,
	"topic" varchar(64) NOT NULL,
	"grade_min" smallint,
	"grade_max" smallint,
	"difficulty" smallint DEFAULT 2 NOT NULL,
	"stem" text NOT NULL,
	"options" text[] NOT NULL,
	"correct_index" smallint NOT NULL,
	"explanation" text NOT NULL,
	"source" varchar(32) DEFAULT 'ustodai' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_attempts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "test_attempts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"subject" varchar(32) NOT NULL,
	"competition" varchar(48),
	"total" smallint NOT NULL,
	"time_limit_sec" integer NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"correct" smallint,
	"score_percent" smallint
);
--> statement-breakpoint
ALTER TABLE "attempt_answers" ADD CONSTRAINT "attempt_answers_attempt_id_test_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."test_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt_answers" ADD CONSTRAINT "attempt_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "questions_subject_stem_key" ON "questions" USING btree ("subject","stem");--> statement-breakpoint
CREATE INDEX "questions_subject_idx" ON "questions" USING btree ("subject");--> statement-breakpoint
CREATE INDEX "test_attempts_user_idx" ON "test_attempts" USING btree ("user_id","started_at");