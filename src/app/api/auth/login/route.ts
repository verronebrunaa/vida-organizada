import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 });
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 });
  }

  await createSession({ id: user.id, email: user.email, name: user.name });

  const redirect = user.profile?.onboardingCompleted ? "/dashboard" : "/onboarding";
  return NextResponse.json({ success: true, redirect });
}
