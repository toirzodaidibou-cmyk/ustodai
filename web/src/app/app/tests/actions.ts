"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { getCompetition } from "@/lib/competitions";
import { getLearningProfile } from "@/lib/profile";
import { getSubject } from "@/lib/subjects";
import { createAttempt, finishAttempt, saveAnswer } from "@/lib/tests";

/** Тести навро оғоз мекунад ва ба экрани тест мегузаронад. */
export async function startTestAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const subject = String(formData.get("subject") ?? "");
  const competitionId = String(formData.get("competition") ?? "") || null;
  if (!getSubject(subject)) redirect("/app");
  const competition = competitionId && getCompetition(competitionId) ? competitionId : null;

  const profile = await getLearningProfile(user.id);
  const grade = profile?.role === "school" ? profile.grade : null;

  const attemptId = await createAttempt(user.id, subject, competition, grade);
  if (!attemptId) redirect(competition ? `/app/competitions/${competition}` : "/app");
  redirect(`/app/tests/${attemptId}`);
}

export async function answerAction(attemptId: number, position: number, chosen: number) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, error: "Аввал ворид шавед." };
  return saveAnswer(user.id, Number(attemptId), Number(position), Number(chosen));
}

export async function finishTestAction(attemptId: number) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");
  await finishAttempt(user.id, Number(attemptId));
  redirect(`/app/tests/${attemptId}`);
}
