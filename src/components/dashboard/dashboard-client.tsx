"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { toggleTask } from "@/app/actions/tasks";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CheckCircle2,
  Circle,
  Trophy,
  Flame,
  TrendingUp,
  TrendingDown,
  Calendar,
  Star,
  Droplets,
  Wind,
} from "lucide-react";

interface DashboardProps {
  userName: string;
  profile: {
    city: string;
    state: string;
    monthlyIncome: number;
  };
  gamification: {
    totalXp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
    badges: string[];
  } | null;
  todayTasks: {
    id: string;
    title: string;
    completed: boolean;
    priority: string;
    category: string;
  }[];
  todayEvents: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    color: string;
    category: string;
  }[];
  financeSummary: {
    totalIncome: number;
    totalExpenses: number;
  };
}

interface WeatherDay {
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

function getWeatherIcon(description: string) {
  const d = description.toLowerCase();
  if (d.includes("tempestade") || d.includes("trovoada")) return CloudLightning;
  if (d.includes("chuva")) return CloudRain;
  if (d.includes("nublado") || d.includes("nuvens")) return Cloud;
  return Sun;
}

function getDayName(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const diff = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  return date.toLocaleDateString("pt-BR", { weekday: "short" });
}

const BADGE_INFO: Record<string, { label: string; emoji: string }> = {
  streak_7: { label: "7 dias seguidos", emoji: "🔥" },
  streak_30: { label: "30 dias seguidos", emoji: "💎" },
  xp_500: { label: "500 XP", emoji: "⭐" },
  xp_1000: { label: "1000 XP", emoji: "🌟" },
  level_5: { label: "Nível 5", emoji: "🏅" },
  level_10: { label: "Nível 10", emoji: "🏆" },
};

export function DashboardClient({
  userName,
  profile,
  gamification,
  todayTasks,
  todayEvents,
  financeSummary,
}: DashboardProps) {
  const [weather, setWeather] = useState<WeatherDay[]>([]);

  useEffect(() => {
    if (profile.city) {
      fetch(`/api/weather?city=${encodeURIComponent(profile.city)}&state=${encodeURIComponent(profile.state)}`)
        .then((r) => r.json())
        .then((d) => setWeather(d.data || []))
        .catch(() => {});
    }
  }, [profile.city, profile.state]);

  const completedTasks = todayTasks.filter((t) => t.completed).length;
  const xpForNextLevel = gamification ? gamification.level * 100 : 100;
  const currentLevelXp = gamification ? gamification.totalXp % 100 : 0;
  const balance = financeSummary.totalIncome - financeSummary.totalExpenses;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {userName.split(" ")[0]}! 👋
        </h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Gamification bar */}
      {gamification && (
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0">
          <CardContent className="py-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Nível {gamification.level}</p>
                  <p className="text-lg font-bold">{gamification.totalXp} XP</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-300" />
                  <div>
                    <p className="text-xs text-white/70">Streak</p>
                    <p className="font-bold">{gamification.currentStreak} dias</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <div>
                    <p className="text-xs text-white/70">Badges</p>
                    <p className="font-bold">{gamification.badges.length}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>Progresso para Nível {gamification.level + 1}</span>
                <span>{currentLevelXp}/{xpForNextLevel} XP</span>
              </div>
              <Progress
                value={currentLevelXp}
                max={xpForNextLevel}
                className="bg-white/20"
                indicatorClassName="bg-white"
              />
            </div>
            {gamification.badges.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {gamification.badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white"
                    title={BADGE_INFO[badge]?.label || badge}
                  >
                    {BADGE_INFO[badge]?.emoji} {BADGE_INFO[badge]?.label || badge}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tarefas de Hoje</CardTitle>
              <Badge variant={completedTasks === todayTasks.length && todayTasks.length > 0 ? "success" : "default"}>
                {completedTasks}/{todayTasks.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Nenhuma tarefa para hoje</p>
            ) : (
              <ul className="space-y-2">
                {todayTasks.slice(0, 5).map((task) => (
                  <li key={task.id} className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                    </button>
                    <span
                      className={`text-sm ${
                        task.completed ? "text-gray-400 line-through" : "text-gray-700"
                      }`}
                    >
                      {task.title}
                    </span>
                    <Badge
                      variant={
                        task.priority === "high"
                          ? "danger"
                          : task.priority === "medium"
                          ? "warning"
                          : "default"
                      }
                      className="ml-auto text-[10px]"
                    >
                      {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Today's Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Agenda de Hoje</CardTitle>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            {todayEvents.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Nenhum evento hoje</p>
            ) : (
              <ul className="space-y-3">
                {todayEvents.map((event) => (
                  <li key={event.id} className="flex items-start gap-3">
                    <div
                      className="mt-1 h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{event.title}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(event.startDate).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(event.endDate).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Finance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Receitas</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(financeSummary.totalIncome)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-600">Despesas</span>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  {formatCurrency(financeSummary.totalExpenses)}
                </span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Saldo</span>
                <span
                  className={`text-base font-bold ${
                    balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(balance)}
                </span>
              </div>
              {profile.monthlyIncome > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Gastos vs Renda</span>
                    <span>
                      {Math.round((financeSummary.totalExpenses / profile.monthlyIncome) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={financeSummary.totalExpenses}
                    max={profile.monthlyIncome}
                    indicatorClassName={
                      financeSummary.totalExpenses > profile.monthlyIncome
                        ? "bg-red-500"
                        : financeSummary.totalExpenses > profile.monthlyIncome * 0.8
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weather */}
      {weather.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Previsão do Tempo — {profile.city}</CardTitle>
              <Sun className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {weather.map((day) => {
                const WeatherIcon = getWeatherIcon(day.description);
                return (
                  <div
                    key={day.date}
                    className="flex flex-col items-center rounded-xl bg-gray-50 p-3 text-center"
                  >
                    <p className="text-xs font-medium text-gray-500 capitalize">
                      {getDayName(day.date)}
                    </p>
                    <WeatherIcon className="my-2 h-8 w-8 text-indigo-500" />
                    <p className="text-lg font-bold text-gray-900">{day.temp}°</p>
                    <p className="text-[10px] text-gray-400">
                      {day.tempMin}° / {day.tempMax}°
                    </p>
                    <p className="mt-1 text-[10px] text-gray-500 capitalize leading-tight">
                      {day.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
                      <span className="flex items-center gap-0.5">
                        <Droplets className="h-3 w-3" />
                        {day.humidity}%
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Wind className="h-3 w-3" />
                        {day.windSpeed}km/h
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
