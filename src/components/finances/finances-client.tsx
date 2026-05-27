"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { createTransaction, deleteTransaction } from "@/app/actions/finances";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

const EXPENSE_CATEGORIES = [
  { value: "food", label: "Alimentação" },
  { value: "transport", label: "Transporte" },
  { value: "housing", label: "Moradia" },
  { value: "health", label: "Saúde" },
  { value: "education", label: "Educação" },
  { value: "entertainment", label: "Lazer" },
  { value: "shopping", label: "Compras" },
  { value: "bills", label: "Contas" },
  { value: "other", label: "Outros" },
];

const INCOME_CATEGORIES = [
  { value: "salary", label: "Salário" },
  { value: "freelance", label: "Freelance" },
  { value: "investment", label: "Investimentos" },
  { value: "other", label: "Outros" },
];

export function FinancesClient({
  monthlyIncome,
  transactions,
}: {
  monthlyIncome: number;
  transactions: Transaction[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const filteredTransactions = transactions.filter((t) => {
    const date = t.date.substring(0, 7);
    return date === filterMonth;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const expensesByCategory = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const categories = transactionType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const CATEGORY_COLORS: Record<string, string> = {
    food: "bg-orange-500",
    transport: "bg-blue-500",
    housing: "bg-purple-500",
    health: "bg-red-500",
    education: "bg-teal-500",
    entertainment: "bg-pink-500",
    shopping: "bg-yellow-500",
    bills: "bg-gray-500",
    other: "bg-gray-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-sm text-gray-500">
            Renda mensal: {formatCurrency(monthlyIncome)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <ArrowUpCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Receitas</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <ArrowDownCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Despesas</p>
                <p className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${balance >= 0 ? "bg-blue-100" : "bg-red-100"}`}>
                <DollarSign className={`h-5 w-5 ${balance >= 0 ? "text-blue-600" : "text-red-600"}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Saldo</p>
                <p className={`text-lg font-bold ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses by Category */}
      {Object.keys(expensesByCategory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(expensesByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const catInfo = EXPENSE_CATEGORIES.find((c) => c.value === category);
                  const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${CATEGORY_COLORS[category] || "bg-gray-400"}`} />
                          <span className="text-sm text-gray-700">{catInfo?.label || category}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(amount)} ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-1.5" />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              Nenhuma transação neste mês
            </p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filteredTransactions.map((t) => {
                const allCats = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
                const catInfo = allCats.find((c) => c.value === t.category);
                return (
                  <li key={t.id} className="flex items-center gap-3 py-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        t.type === "income" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {t.type === "income" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{t.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {new Date(t.date).toLocaleDateString("pt-BR")}
                        </span>
                        <Badge variant="default">{catInfo?.label || t.category}</Badge>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"} {formatCurrency(t.amount)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Add Transaction Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nova Transação">
        <form action={createTransaction} onSubmit={() => setShowModal(false)} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTransactionType("expense")}
              className={`flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-colors ${
                transactionType === "expense"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setTransactionType("income")}
              className={`flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-colors ${
                transactionType === "income"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              Receita
            </button>
          </div>

          <input type="hidden" name="type" value={transactionType} />

          <Input
            id="tx-amount"
            name="amount"
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            required
          />
          <Input
            id="tx-desc"
            name="description"
            label="Descrição"
            placeholder="Ex: Supermercado"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              name="category"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <Input
            id="tx-date"
            name="date"
            label="Data"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            required
          />

          <Button type="submit" className="w-full">
            Adicionar
          </Button>
        </form>
      </Modal>
    </div>
  );
}
