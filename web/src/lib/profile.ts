import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { userCompetitions, userProfiles, userSubjects } from "@/db/schema";
import { COMPETITIONS, type Role } from "@/lib/competitions";
import { SUBJECT_IDS, type SubjectId } from "@/lib/subjects";

export type LearningProfile = {
  /** null — профили кӯҳна, ки ҳанӯз қадами «Шумо кистед?»-ро нагузаштааст */
  role: Role | null;
  grade: number | null;
  institution: "college" | "university" | null;
  course: number | null;
  subjects: SubjectId[];
  competitions: string[];
};

/** Профили омӯзишии корбар ё null, агар ӯ ҳанӯз onboarding-ро нагузашта бошад. */
export async function getLearningProfile(userId: string): Promise<LearningProfile | null> {
  const [[profile], subjects, competitions] = await Promise.all([
    db
      .select({
        role: userProfiles.role,
        grade: userProfiles.grade,
        institution: userProfiles.institution,
        course: userProfiles.course,
      })
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId)),
    db
      .select({ subject: userSubjects.subject })
      .from(userSubjects)
      .where(eq(userSubjects.userId, userId))
      .orderBy(asc(userSubjects.createdAt)),
    db
      .select({ competition: userCompetitions.competition })
      .from(userCompetitions)
      .where(eq(userCompetitions.userId, userId))
      .orderBy(asc(userCompetitions.createdAt)),
  ]);
  if (!profile) return null;
  const known = new Set(COMPETITIONS.map((c) => c.id));
  return {
    role: (profile.role as Role | null) ?? null,
    grade: profile.grade,
    institution: (profile.institution as LearningProfile["institution"]) ?? null,
    course: profile.course,
    // Фанҳо ва озмунҳое, ки аз каталог хориҷ шудаанд, нишон дода намешаванд
    subjects: subjects.map((s) => s.subject).filter((s): s is SubjectId => SUBJECT_IDS.includes(s as SubjectId)),
    competitions: competitions.map((c) => c.competition).filter((c) => known.has(c)),
  };
}

/** Профил пурра аст, агар нақш ва ақаллан як фан интихоб шуда бошад. */
export function isProfileComplete(p: LearningProfile | null): p is LearningProfile & { role: Role } {
  return !!p && !!p.role && p.subjects.length > 0;
}
