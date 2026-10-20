-- Маълумоти омӯзиш ба корбари Neon Auth пайваст аст: ҳангоми нест кардани корбар онҳо низ нест мешаванд
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_user_id_neon_auth_user_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade;--> statement-breakpoint
ALTER TABLE "review_logs" ADD CONSTRAINT "review_logs_user_id_neon_auth_user_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade;
