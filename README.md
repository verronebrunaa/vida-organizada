# Vida Organizada ✨

Um planner pessoal completo para organizar sua vida em um só lugar — agenda, tarefas, finanças e clima.

## Funcionalidades

- **Agenda/Calendário** — Visualização mensal com eventos, trabalho e hobbies
- **Tarefas** — To-do list com prioridades, categorias e recorrência
- **Financeiro** — Controle de gastos e receitas com visualizações por categoria
- **Clima** — Previsão do tempo semanal baseada na sua localização
- **Gamificação** — Sistema de XP, streaks e badges por completar tarefas
- **Onboarding** — Formulário inicial para personalizar a experiência
- **Dashboard** — Visão geral integrada de tudo

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** para estilização
- **Prisma** + SQLite para banco de dados
- **Lucide React** para ícones
- **bcryptjs** + **jose** (JWT) para autenticação

## Setup

```bash
# Instalar dependências
npm install

# Gerar o Prisma Client
npx prisma generate

# Rodar as migrations
npx prisma migrate dev

# Iniciar o servidor de desenvolvimento
npm run dev
```

O app estará disponível em [http://localhost:3000](http://localhost:3000).

## Variáveis de Ambiente (opcional)

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-aqui"
OPENWEATHER_API_KEY="sua-chave-da-openweathermap"
```

> Sem a chave da OpenWeatherMap, o app usará dados simulados de clima.

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/          # Páginas de login e registro
│   ├── (app)/           # Páginas protegidas (dashboard, calendar, tasks, finances)
│   ├── api/             # Route handlers (auth, weather, onboarding)
│   └── actions/         # Server actions (tasks, events, finances)
├── components/          # Componentes React
│   ├── ui/              # Componentes base (Button, Input, Card, Modal, etc.)
│   ├── dashboard/       # Componentes do dashboard
│   ├── calendar/        # Componentes do calendário
│   ├── tasks/           # Componentes de tarefas
│   └── finances/        # Componentes financeiros
└── lib/                 # Utilitários (auth, prisma, utils)
```
