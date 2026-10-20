"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { userCompetitions, userProfiles, userSubjects } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/server";
import { COMPETITIONS, recommendCompetitions, type Role } from "@/lib/competitions";
import { SUBJECT_IDS, type SubjectId } from "@/lib/subjects";

export type OnboardingInput = {
  role: string;
  grade?: number | null;
  institution?: string | null;
  course?: number | null;
  subjects: string[];
  competitions: string[];
};

export type OnboardingResult = { error: string } | null;

const ROLES: Role[] = ["school", "student", "self"];

export async function saveOnboarding(input: OnboardingInput): Promise<OnboardingResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Аввал ворид шавед." };

  const role = ROLES.find((r) => r === input.role);
  if (!role) return { error: "Нишон диҳед, ки шумо кистед." };

  let grade: number | null = null;
  let institution: "college" | "university" | null = null;
  let course: number | null = null;

  if (role === "school") {
    grade = Number(input.grade);
    if (!Number.isInteger(grade) || grade < 5 || grade > 11) return { error: "Синфи худро интихоб кунед (5–11)." };
  }
  if (role === "student") {
    institution = input.institution === "college" || input.institution === "university" ? input.institution : null;
    if (!institution) return { error: "Коллеҷ ё донишгоҳро интихоб кунед." };
    course = Number(input.course);
    const maxCourse = institution === "college" ? 4 : 5;
    if (!Number.isInteger(course) || course < 1 || course > maxCourse) return { error: "Курси худро интихоб кунед." };
  }

  const subjects = [...new Set(input.subjects)].filter((s): s is SubjectId => SUBJECT_IDS.includes(s as SubjectId));
  if (subjects.length === 0) return { error: "Ақаллан як фанро интихоб кунед." };

  // Танҳо озмунҳое, ки ба нақш ва синфи корбар мувофиқанд, қабул мешаванд
  const allowed = new Set(recommendCompetitions({ role, grade }).map((c) => c.id));
  const known = new Set(COMPETITIONS.map((c) => c.id));
  const competitions = [...new Set(input.competitions)].filter((c) => known.has(c) && allowed.has(c));

  try {
    await db.transaction(async (tx) => {
      const values = { role, grade, institution, course, updatedAt: new Date() };
      await tx
        .insert(userProfiles)
        .values({ userId: user.id, ...values })
        .onConflictDoUpdate({ target: userProfiles.userId, set: values });
      await tx.delete(userSubjects).where(eq(userSubjects.userId, user.id));
      await tx.insert(userSubjects).values(subjects.map((subject) => ({ userId: user.id, subject })));
      await tx.delete(userCompetitions).where(eq(userCompetitions.userId, user.id));
      if (competitions.length) {
        await tx.insert(userCompetitions).values(competitions.map((competition) => ({ userId: user.id, competition })));
      }
    });
  } catch (error) {
    console.error("[onboarding] save failed", error);
    return { error: "Захира нашуд. Интернетро санҷед ва боз кӯшиш кунед." };
  }

  redirect("/app");
}
