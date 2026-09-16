"use client";

import { useRouter } from "next/navigation";
import { ROLE_LABELS } from "@/lib/enums";

export default function Topbar({ name, role }: { name: string; role: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
      <div className="md:hidden font-semibold text-brand-700">Vita Vina ERP</div>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        <div className="text-sm text-right">
          <div className="font-medium text-gray-800">{name}</div>
          <div className="text-xs text-gray-500">{ROLE_LABELS[role] ?? role}</div>
        </div>
        <button onClick={logout} className="btn-secondary text-xs px-3 py-1.5">
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
