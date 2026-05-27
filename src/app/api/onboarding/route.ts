import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  await prisma.userProfile.upsert({
    where: { userId: session.id },
    update: {
      objective: body.objective,
      city: body.city,
      state: body.state,
      country: body.country,
      monthlyIncome: parseFloat(body.monthlyIncome) || 0,
      hobbies: body.hobbies,
      workStartTime: body.workStartTime,
      workEndTime: body.workEndTime,
      onboardingCompleted: true,
    },
    create: {
      userId: session.id,
      objective: body.objective,
      city: body.city,
      state: body.state,
      country: body.country,
      monthlyIncome: parseFloat(body.monthlyIncome) || 0,
      hobbies: body.hobbies,
      workStartTime: body.workStartTime,
      workEndTime: body.workEndTime,
      onboardingCompleted: true,
    },
  });

  return NextResponse.json({ success: true });
}
