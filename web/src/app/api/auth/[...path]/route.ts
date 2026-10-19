import { auth } from "@/lib/auth/server";

// Ҳамаи дархостҳои Better Auth ба Neon Auth прокси мешаванд
export const { GET, POST, PUT, DELETE, PATCH } = auth.handler();
