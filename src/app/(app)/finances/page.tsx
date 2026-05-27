import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FinancesClient } from "@/components/finances/finances-client";

export default async function FinancesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { profile: true },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.id },
    orderBy: { date: "desc" },
  });

  return (
    <FinancesClient
      monthlyIncome={user?.profile?.monthlyIncome || 0}
      transactions={transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        category: t.category,
        date: t.date.toISOString(),
      }))}
    />
  );
}
