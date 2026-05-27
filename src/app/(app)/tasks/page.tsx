import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TasksClient } from "@/components/tasks/tasks-client";

export default async function TasksPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const tasks = await prisma.task.findMany({
    where: { userId: session.id },
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });

  return (
    <TasksClient
      tasks={tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        completed: t.completed,
        priority: t.priority,
        category: t.category,
        dueDate: t.dueDate?.toISOString() || null,
        recurring: t.recurring,
        xpEarned: t.xpEarned,
        createdAt: t.createdAt.toISOString(),
      }))}
    />
  );
}
