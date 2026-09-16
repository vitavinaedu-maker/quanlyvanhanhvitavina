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
