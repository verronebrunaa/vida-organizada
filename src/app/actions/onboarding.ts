"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function saveOnboarding(formData: FormData) {
  const session = await requireAuth();

  const objective = formData.get("objective") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const country = formData.get("country") as string;
  const monthlyIncome = parseFloat(formData.get("monthlyIncome") as string) || 0;
  const hobbies = formData.get("hobbies") as string;
  const workStartTime = formData.get("workStartTime") as string;
  const workEndTime = formData.get("workEndTime") as string;

  await prisma.userProfile.upsert({
    where: { userId: session.id },
    update: {
      objective,
      city,
      state,
      country,
      monthlyIncome,
      hobbies,
      workStartTime,
      workEndTime,
      onboardingCompleted: true,
    },
    create: {
      userId: session.id,
      objective,
      city,
      state,
      country,
      monthlyIncome,
      hobbies,
      workStartTime,
      workEndTime,
      onboardingCompleted: true,
    },
  });

  redirect("/dashboard");
}
