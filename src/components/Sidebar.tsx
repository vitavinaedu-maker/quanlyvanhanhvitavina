"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { canAccessModule, type Role } from "@/lib/rbac";

type MenuItem = { href: string; label: string; moduleKey: string };
type MenuGroup = { title: string; items: MenuItem[] };

const MENU: MenuGroup[] = [
  { title: "", items: [{ href: "/tong-quan", label: "Tổng quan", moduleKey: "tong-quan" }] },
  { title: "", items: [{ href: "/crm", label: "CRM", moduleKey: "crm" }] },
  {
    title: "Du học",
    items: [
      { href: "/du-hoc", label: "Tổng quan Du học", moduleKey: "du-hoc" },
      { href: "/du-hoc/ho-so", label: "Hồ sơ học viên", moduleKey: "du-hoc" },
      { href: "/du-hoc/trung-tam", label: "Trung tâm du học", moduleKey: "du-hoc" },
    ],
  },
  {
    title: "Du học nghề",
    items: [
      { href: "/du-hoc-nghe", label: "Tổng quan DH nghề", moduleKey: "du-hoc-nghe" },
      { href: "/du-hoc-nghe/ho-so", label: "Hồ sơ học viên", moduleKey: "du-hoc-nghe" },
    ],
  },
  {
    title: "",
    items: [
      { href: "/nhan-su", label: "Nhân sự", moduleKey: "nhan-su" },
      { href: "/nhan-su/cong-viec", label: "Công việc / Workflow", moduleKey: "nhan-su" },
      { href: "/doi-tac", label: "Đối tác", moduleKey: "doi-tac" },
      { href: "/tai-chinh", label: "Tài chính", moduleKey: "tai-chinh" },
      { href: "/kinh-doanh", label: "Kinh doanh", moduleKey: "kinh-doanh" },
      { href: "/marketing", label: "Marketing tự động", moduleKey: "marketing" },
      { href: "/kho", label: "Kho", moduleKey: "kho" },
      { href: "/cai-dat", label: "Cài đặt", moduleKey: "cai-dat" },
    ],
  },
];

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-brand-700 text-white shrink-0">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="text-lg font-semibold">Vita Vina ERP</div>
        <div className="text-xs text-white/60">Quản lý du học & du học nghề</div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        {MENU.map((group, i) => (
          <div key={i} className="mb-2">
            {group.title && (
              <div className="px-5 pt-3 pb-1 text-[11px] uppercase tracking-wide text-white/50">
                {group.title}
              </div>
            )}
            {group.items
              .filter((item) => canAccessModule(role, item.moduleKey))
              .map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-5 py-2 text-sm ${
                      active ? "bg-white/10 text-white font-medium" : "text-white/80 hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
