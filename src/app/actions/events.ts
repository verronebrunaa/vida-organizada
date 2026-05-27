"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const session = await requireAuth();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const color = formData.get("color") as string || "#6366f1";
  const category = formData.get("category") as string || "personal";
  const recurring = formData.get("recurring") as string;

  await prisma.event.create({
    data: {
      userId: session.id,
      title,
      description: description || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      color,
      category,
      recurring: recurring || null,
    },
  });

  revalidatePath("/calendar");
  revalidatePath("/dashboard");
}

export async function deleteEvent(eventId: string) {
  const session = await requireAuth();

  await prisma.event.deleteMany({
    where: { id: eventId, userId: session.id },
  });

  revalidatePath("/calendar");
  revalidatePath("/dashboard");
}
