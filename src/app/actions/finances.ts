"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: FormData) {
  const session = await requireAuth();

  const type = formData.get("type") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;

  if (!type || !amount || !description || !category || !date) {
    throw new Error("Todos os campos são obrigatórios");
  }

  await prisma.transaction.create({
    data: {
      userId: session.id,
      type,
      amount,
      description,
      category,
      date: new Date(date),
    },
  });

  revalidatePath("/finances");
  revalidatePath("/dashboard");
}

export async function deleteTransaction(transactionId: string) {
  const session = await requireAuth();

  await prisma.transaction.deleteMany({
    where: { id: transactionId, userId: session.id },
  });

  revalidatePath("/finances");
  revalidatePath("/dashboard");
}
