"use server";

import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

interface AuthResult {
  error?: string;
}

export async function registerAction(formData: FormData): Promise<AuthResult> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Todos os campos são obrigatórios" };
  }

  if (password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres" };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Este email já está cadastrado" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  await prisma.gamification.create({
    data: { userId: user.id },
  });

  await createSession({ id: user.id, email: user.email, name: user.name });
  redirect("/onboarding");
}

export async function loginAction(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user) {
    return { error: "Email ou senha incorretos" };
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    return { error: "Email ou senha incorretos" };
  }

  await createSession({ id: user.id, email: user.email, name: user.name });

  if (!user.profile?.onboardingCompleted) {
    redirect("/onboarding");
  }

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
