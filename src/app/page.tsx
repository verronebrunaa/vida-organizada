import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  CheckSquare,
  DollarSign,
  CloudSun,
  Trophy,
  Sparkles,
} from "lucide-react";

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero */}
      <div className="mx-auto max-w-5xl px-4 pt-20 pb-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Vida Organizada
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
          Organize sua agenda, tarefas, finanças e muito mais — tudo em um só lugar.
          Feito para quem precisa de clareza e simplicidade no dia a dia.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            Começar Agora
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            Já tenho conta
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-5xl px-4 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Calendar,
              title: "Agenda",
              description: "Visualize seus compromissos, trabalho e hobbies em um calendário integrado.",
              color: "bg-indigo-100 text-indigo-600",
            },
            {
              icon: CheckSquare,
              title: "Tarefas",
              description: "Organize suas tarefas com prioridades, categorias e recorrência.",
              color: "bg-green-100 text-green-600",
            },
            {
              icon: DollarSign,
              title: "Financeiro",
              description: "Controle seus gastos e receitas com visualizações por categoria.",
              color: "bg-yellow-100 text-yellow-600",
            },
            {
              icon: CloudSun,
              title: "Clima",
              description: "Previsão do tempo semanal para planejar suas atividades ao ar livre.",
              color: "bg-blue-100 text-blue-600",
            },
            {
              icon: Trophy,
              title: "Gamificação",
              description: "Ganhe XP, mantenha streaks e desbloqueie badges completando tarefas.",
              color: "bg-purple-100 text-purple-600",
            },
            {
              icon: Sparkles,
              title: "Tudo Integrado",
              description: "Dashboard com visão geral do seu dia, semana e mês em um só lugar.",
              color: "bg-pink-100 text-pink-600",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className={`inline-flex rounded-xl p-3 ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
