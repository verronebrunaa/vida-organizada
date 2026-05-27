"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const session = await requireAuth();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string || "medium";
  const category = formData.get("category") as string || "personal";
  const dueDateStr = formData.get("dueDate") as string;
  const recurring = formData.get("recurring") as string;

  await prisma.task.create({
    data: {
      userId: session.id,
      title,
      description: description || null,
      priority,
      category,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      recurring: recurring || null,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function toggleTask(taskId: string) {
  const session = await requireAuth();

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId: session.id },
  });

  if (!task) throw new Error("Task not found");

  const completed = !task.completed;
  let xpEarned = 0;

  if (completed && !task.completedAt) {
    const xpMap: Record<string, number> = { low: 5, medium: 10, high: 20 };
    xpEarned = xpMap[task.priority] || 10;

    const gamification = await prisma.gamification.findUnique({
      where: { userId: session.id },
    });

    if (gamification) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastActivity = gamification.lastActivityDate
        ? new Date(gamification.lastActivityDate)
        : null;

      let newStreak = gamification.currentStreak;
      if (lastActivity) {
        lastActivity.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const newTotalXp = gamification.totalXp + xpEarned;
      const newLevel = Math.floor(newTotalXp / 100) + 1;

      const badges = JSON.parse(gamification.badges) as string[];
      if (newStreak >= 7 && !badges.includes("streak_7")) badges.push("streak_7");
      if (newStreak >= 30 && !badges.includes("streak_30")) badges.push("streak_30");
      if (newTotalXp >= 500 && !badges.includes("xp_500")) badges.push("xp_500");
      if (newTotalXp >= 1000 && !badges.includes("xp_1000")) badges.push("xp_1000");
      if (newLevel >= 5 && !badges.includes("level_5")) badges.push("level_5");
      if (newLevel >= 10 && !badges.includes("level_10")) badges.push("level_10");

      await prisma.gamification.update({
        where: { userId: session.id },
        data: {
          totalXp: newTotalXp,
          level: newLevel,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, gamification.longestStreak),
          lastActivityDate: today,
          badges: JSON.stringify(badges),
        },
      });
    }
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      completed,
      completedAt: completed ? new Date() : null,
      xpEarned: completed ? xpEarned : 0,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string) {
  const session = await requireAuth();

  await prisma.task.deleteMany({
    where: { id: taskId, userId: session.id },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}
