import { Sidebar } from "@/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-4 pt-16 lg:p-8 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
