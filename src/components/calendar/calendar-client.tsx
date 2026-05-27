"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { createEvent, deleteEvent } from "@/app/actions/events";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  color: string;
  category: string;
}

const CATEGORIES = [
  { value: "personal", label: "Pessoal", color: "#6366f1" },
  { value: "work", label: "Trabalho", color: "#f59e0b" },
  { value: "hobby", label: "Hobby", color: "#10b981" },
  { value: "health", label: "Saúde", color: "#ef4444" },
  { value: "study", label: "Estudo", color: "#8b5cf6" },
];

const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function CalendarClient({ events }: { events: CalendarEvent[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("personal");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function getEventsForDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.startDate.startsWith(dateStr));
  }

  function handleDayClick(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setShowModal(true);
  }

  const selectedDayEvents = selectedDate
    ? events.filter((e) => e.startDate.startsWith(selectedDate))
    : [];

  const categoryObj = CATEGORIES.find((c) => c.value === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
        <Button onClick={() => { setSelectedDate(new Date().toISOString().split("T")[0]); setShowModal(true); }}>
          <Plus className="h-4 w-4" />
          Novo Evento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle>
              {MONTHS_PT[month]} {year}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px">
            {DAYS_PT.map((day) => (
              <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`min-h-[80px] rounded-lg border p-1.5 text-left transition-colors hover:bg-gray-50 ${
                    isToday ? "border-indigo-300 bg-indigo-50" : "border-transparent"
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      isToday
                        ? "bg-indigo-600 text-white font-bold"
                        : "text-gray-700"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="truncate rounded px-1 py-0.5 text-[10px] font-medium text-white"
                        style={{ backgroundColor: event.color }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <p className="text-[10px] text-gray-400 px-1">
                        +{dayEvents.length - 3} mais
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={selectedDate ? `Eventos — ${new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR")}` : "Novo Evento"}
      >
        {/* Existing events for this day */}
        {selectedDayEvents.length > 0 && (
          <div className="mb-4 space-y-2">
            {selectedDayEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {new Date(event.startDate).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(event.endDate).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new event form */}
        <form action={createEvent} onSubmit={() => setShowModal(false)} className="space-y-3">
          <Input id="event-title" name="title" label="Título" placeholder="Nome do evento" required />
          <Input id="event-description" name="description" label="Descrição" placeholder="Descrição (opcional)" />

          <div className="grid grid-cols-2 gap-3">
            <Input
              id="event-start"
              name="startDate"
              label="Início"
              type="datetime-local"
              defaultValue={selectedDate ? `${selectedDate}T09:00` : ""}
              required
            />
            <Input
              id="event-end"
              name="endDate"
              label="Fim"
              type="datetime-local"
              defaultValue={selectedDate ? `${selectedDate}T10:00` : ""}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? "text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={selectedCategory === cat.value ? { backgroundColor: cat.color } : {}}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <input type="hidden" name="category" value={selectedCategory} />
          <input type="hidden" name="color" value={categoryObj?.color || "#6366f1"} />

          <Button type="submit" className="w-full">
            Adicionar Evento
          </Button>
        </form>
      </Modal>
    </div>
  );
}
