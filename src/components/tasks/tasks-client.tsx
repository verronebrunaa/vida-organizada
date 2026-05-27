"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { createTask, toggleTask, deleteTask } from "@/app/actions/tasks";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Filter,
  Sparkles,
  Calendar,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  category: string;
  dueDate: string | null;
  recurring: string | null;
  xpEarned: number;
  createdAt: string;
}

const PRIORITIES = [
  { value: "low", label: "Baixa", color: "default" as const },
  { value: "medium", label: "Média", color: "warning" as const },
  { value: "high", label: "Alta", color: "danger" as const },
];

const CATEGORIES = [
  { value: "personal", label: "Pessoal" },
  { value: "work", label: "Trabalho" },
  { value: "health", label: "Saúde" },
  { value: "hobby", label: "Hobby" },
  { value: "finance", label: "Financeiro" },
  { value: "study", label: "Estudo" },
  { value: "house", label: "Casa" },
];

export function TasksClient({ tasks }: { tasks: Task[] }) {
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState("medium");
  const [selectedCategory, setSelectedCategory] = useState("personal");

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    return true;
  });

  const pendingTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  const totalXp = tasks.reduce((sum, t) => sum + t.xpEarned, 0);
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-sm text-gray-500">
            {completedCount} de {tasks.length} concluídas · {totalXp} XP ganhos
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todas categorias</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Todas prioridades</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Pendentes ({pendingTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingTasks.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              Nenhuma tarefa pendente 🎉
            </p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {pendingTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Concluídas ({completedTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-50">
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Add Task Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nova Tarefa">
        <form action={createTask} onSubmit={() => setShowModal(false)} className="space-y-4">
          <Input id="task-title" name="title" label="Título" placeholder="O que precisa fazer?" required />
          <Input id="task-desc" name="description" label="Descrição" placeholder="Detalhes (opcional)" />
          <Input id="task-due" name="dueDate" label="Data de entrega" type="date" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setSelectedPriority(p.value)}
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                    selectedPriority === p.value
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedCategory(c.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategory === c.value
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recorrência</label>
            <select
              name="recurring"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Sem recorrência</option>
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>

          <input type="hidden" name="priority" value={selectedPriority} />
          <input type="hidden" name="category" value={selectedCategory} />

          <Button type="submit" className="w-full">
            Criar Tarefa
          </Button>
        </form>
      </Modal>
    </div>
  );
}

function TaskItem({ task }: { task: Task }) {
  const priorityInfo = PRIORITIES.find((p) => p.value === task.priority);
  const categoryInfo = CATEGORIES.find((c) => c.value === task.category);

  return (
    <li className="flex items-center gap-3 py-3">
      <button onClick={() => toggleTask(task.id)} className="shrink-0">
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-gray-300 hover:text-gray-400" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${task.completed ? "text-gray-400 line-through" : "text-gray-700"}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString("pt-BR")}
            </span>
          )}
          {categoryInfo && (
            <span className="text-xs text-gray-400">{categoryInfo.label}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {task.xpEarned > 0 && (
          <span className="flex items-center gap-1 text-xs text-indigo-500">
            <Sparkles className="h-3 w-3" />
            +{task.xpEarned} XP
          </span>
        )}
        <Badge variant={priorityInfo?.color || "default"}>
          {priorityInfo?.label || task.priority}
        </Badge>
        <button
          onClick={() => deleteTask(task.id)}
          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
