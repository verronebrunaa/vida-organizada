"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    if (formData.get("password") !== formData.get("confirmPassword")) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao cadastrar");
        setLoading(false);
        return;
      }

      router.push("/onboarding");
    } catch {
      setError("Erro ao conectar com o servidor");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Criar Conta</h1>
            <p className="mt-1 text-sm text-gray-500">Comece a organizar sua vida hoje</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              name="name"
              label="Nome"
              placeholder="Seu nome"
              required
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="seu@email.com"
              required
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Senha"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmar Senha"
              placeholder="••••••••"
              minLength={6}
              required
            />

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
