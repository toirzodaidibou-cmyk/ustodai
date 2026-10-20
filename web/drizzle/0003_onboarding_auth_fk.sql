-- Профил ва фанҳо ба корбари Neon Auth пайваст ҳастанд: ҳангоми нест кардани корбар онҳо низ нест мешаванд
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_neon_auth_user_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "user_subjects" ADD CONSTRAINT "user_subjects_user_id_neon_auth_user_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade;
