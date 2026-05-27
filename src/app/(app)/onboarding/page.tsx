"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  MapPin,
  DollarSign,
  Heart,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const STEPS = [
  { icon: Target, title: "Seu Objetivo", description: "O que você quer organizar?" },
  { icon: MapPin, title: "Localização", description: "Onde você mora?" },
  { icon: DollarSign, title: "Financeiro", description: "Qual sua renda mensal?" },
  { icon: Heart, title: "Hobbies", description: "O que você gosta de fazer?" },
  { icon: Clock, title: "Trabalho", description: "Qual seu horário de trabalho?" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    objective: "",
    city: "",
    state: "",
    country: "Brasil",
    monthlyIncome: "",
    hobbies: "",
    workStartTime: "09:00",
    workEndTime: "18:00",
  });

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => fd.append(key, value));

      const res = await fetch("/api/onboarding", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        window.location.href = "/dashboard";
      }
    } catch {
      setLoading(false);
    }
  }

  const StepIcon = STEPS[step].icon;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="pt-8 pb-8">
          <div className="mb-6">
            <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />
            <p className="mt-2 text-xs text-gray-500 text-right">
              {step + 1} de {STEPS.length}
            </p>
          </div>

          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
              <StepIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{STEPS[step].title}</h2>
            <p className="text-sm text-gray-500">{STEPS[step].description}</p>
          </div>

          <div className="space-y-4">
            {step === 0 && (
              <div className="space-y-3">
                {[
                  "Organizar minha rotina diária",
                  "Melhorar minha produtividade",
                  "Controlar minhas finanças",
                  "Equilibrar trabalho e vida pessoal",
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateField("objective", option)}
                    className={`w-full rounded-lg border-2 p-3 text-left text-sm transition-colors ${
                      formData.objective === option
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <Input
                  id="city"
                  label="Cidade"
                  placeholder="Ex: São Paulo"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
                <Input
                  id="state"
                  label="Estado"
                  placeholder="Ex: SP"
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                />
                <Input
                  id="country"
                  label="País"
                  value={formData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <Input
                  id="monthlyIncome"
                  label="Renda mensal aproximada (R$)"
                  type="number"
                  placeholder="Ex: 5000"
                  value={formData.monthlyIncome}
                  onChange={(e) => updateField("monthlyIncome", e.target.value)}
                />
                <p className="mt-2 text-xs text-gray-400">
                  Essa informação será usada apenas para te ajudar no planejamento financeiro
                </p>
              </div>
            )}

            {step === 3 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quais são seus hobbies e atividades?
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Ex: Correr, ler, cozinhar, jogar videogame..."
                  value={formData.hobbies}
                  onChange={(e) => updateField("hobbies", e.target.value)}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                <Input
                  id="workStartTime"
                  label="Início do expediente"
                  type="time"
                  value={formData.workStartTime}
                  onChange={(e) => updateField("workStartTime", e.target.value)}
                />
                <Input
                  id="workEndTime"
                  label="Fim do expediente"
                  type="time"
                  value={formData.workEndTime}
                  onChange={(e) => updateField("workEndTime", e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} className="flex-1">
                Próximo
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? (
                  "Salvando..."
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Começar!
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
