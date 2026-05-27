import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CalendarClient } from "@/components/calendar/calendar-client";

export default async function CalendarPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const events = await prisma.event.findMany({
    where: { userId: session.id },
    orderBy: { startDate: "asc" },
  });

  return (
    <CalendarClient
      events={events.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate.toISOString(),
        color: e.color,
        category: e.category,
      }))}
    />
  );
}
