import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { profile: true, gamification: true },
  });

  if (!user) redirect("/login");
  if (!user.profile?.onboardingCompleted) redirect("/onboarding");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

  const [todayTasks, todayEvents, monthTransactions] = await Promise.all([
    prisma.task.findMany({
      where: {
        userId: session.id,
        OR: [
          { dueDate: { gte: today, lte: endOfDay } },
          { completed: false, dueDate: null },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.event.findMany({
      where: {
        userId: session.id,
        startDate: { gte: today, lte: endOfDay },
      },
      orderBy: { startDate: "asc" },
    }),
    prisma.transaction.findMany({
      where: {
        userId: session.id,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
    }),
  ]);

  const totalIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardClient
      userName={user.name}
      profile={{
        city: user.profile?.city || "",
        state: user.profile?.state || "",
        monthlyIncome: user.profile?.monthlyIncome || 0,
      }}
      gamification={
        user.gamification
          ? {
              totalXp: user.gamification.totalXp,
              level: user.gamification.level,
              currentStreak: user.gamification.currentStreak,
              longestStreak: user.gamification.longestStreak,
              badges: JSON.parse(user.gamification.badges) as string[],
            }
          : null
      }
      todayTasks={todayTasks.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
        priority: t.priority,
        category: t.category,
      }))}
      todayEvents={todayEvents.map((e) => ({
        id: e.id,
        title: e.title,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate.toISOString(),
        color: e.color,
        category: e.category,
      }))}
      financeSummary={{ totalIncome, totalExpenses }}
    />
  );
}
