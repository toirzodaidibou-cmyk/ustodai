-- Озмунҳои корбар ба корбари Neon Auth пайваст ҳастанд
ALTER TABLE "user_competitions" ADD CONSTRAINT "user_competitions_user_id_neon_auth_user_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade;--> statement-breakpoint
-- Профилҳои кӯҳна: «худомӯзӣ» рост ба нақш мегузарад; дигарон (мактаб/ММТ) синф ё курсро бояд нишон диҳанд, бинобар ин role = null мемонад
UPDATE "user_profiles" SET "role" = 'self' WHERE "goal" = 'self' AND "role" IS NULL;
