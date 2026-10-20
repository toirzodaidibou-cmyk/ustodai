-- Кӯшишҳои тест ба корбари Neon Auth пайваст ҳастанд
ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_user_id_neon_auth_user_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade;
