// Điều khiển truy cập theo vai trò (RBAC) ở mức module.
// ADMIN: toàn quyền. MANAGER/STAFF: giới hạn theo danh sách dưới đây.
// Đây là kiểm soát mức module cho MVP; kiểm soát theo trường dữ liệu có thể bổ sung sau.

export type Role = "ADMIN" | "MANAGER" | "STAFF";

export const MODULE_ROLES: Record<string, Role[]> = {
  "tong-quan": ["ADMIN", "MANAGER", "STAFF"],
  crm: ["ADMIN", "MANAGER", "STAFF"],
  "du-hoc": ["ADMIN", "MANAGER", "STAFF"],
  "du-hoc-nghe": ["ADMIN", "MANAGER", "STAFF"],
  "nhan-su": ["ADMIN", "MANAGER"],
  "doi-tac": ["ADMIN", "MANAGER", "STAFF"],
  "tai-chinh": ["ADMIN", "MANAGER"],
  "kinh-doanh": ["ADMIN", "MANAGER", "STAFF"],
  marketing: ["ADMIN", "MANAGER", "STAFF"],
  kho: ["ADMIN", "MANAGER", "STAFF"],
  "cai-dat": ["ADMIN"],
};

export function canAccessModule(role: Role, moduleKey: string) {
  const allowed = MODULE_ROLES[moduleKey];
  if (!allowed) return true;
  return allowed.includes(role);
}

// Entity (khoá dùng trong /api/data/[entity]) -> module để kiểm tra quyền.
// Đây là chốt chặn thật sự (API), việc ẩn menu ở Sidebar chỉ là UX.
export const ENTITY_MODULE: Record<string, string> = {
  departments: "cai-dat",
  users: "cai-dat",
  employees: "nhan-su",
  partners: "doi-tac",
  centers: "du-hoc",
  leads: "crm",
  students: "du-hoc",
  documentItems: "kho",
  tasks: "nhan-su",
  invoices: "tai-chinh",
  payments: "tai-chinh",
  deals: "kinh-doanh",
  campaigns: "marketing",
  inventoryItems: "kho",
  inventoryTransactions: "kho",
};

export function moduleForEntity(entityKey: string): string | undefined {
  return ENTITY_MODULE[entityKey];
}
