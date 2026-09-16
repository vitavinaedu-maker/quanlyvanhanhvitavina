import { prisma } from "./prisma";
import { hashPassword } from "./auth";
import { getEntity, type FieldConfig } from "./entities";

// Ánh xạ entity key (dùng trong URL /api/data/[entity]) -> Prisma delegate.
const DELEGATES: Record<string, any> = {
  departments: prisma.department,
  users: prisma.user,
  employees: prisma.employee,
  partners: prisma.partner,
  centers: prisma.center,
  leads: prisma.lead,
  students: prisma.student,
  documentItems: prisma.documentItem,
  tasks: prisma.task,
  invoices: prisma.invoice,
  payments: prisma.payment,
  deals: prisma.deal,
  campaigns: prisma.campaign,
  inventoryItems: prisma.inventoryItem,
  inventoryTransactions: prisma.inventoryTransaction,
};

// Entity nào có audit trail "người tạo" (createdById -> User).
export const CREATED_BY_ENTITIES = new Set([
  "partners",
  "centers",
  "leads",
  "students",
  "documentItems",
  "tasks",
  "invoices",
  "payments",
  "deals",
  "campaigns",
  "inventoryItems",
  "inventoryTransactions",
]);

const CREATED_BY_SELECT = { createdBy: { select: { id: true, name: true, email: true } } };

// Include quan hệ trực tiếp để hiển thị nhãn trong bảng (client tự format).
const INCLUDES: Record<string, any> = {
  employees: { department: true, user: { select: { id: true, name: true, email: true, role: true } } },
  partners: { ...CREATED_BY_SELECT },
  centers: { manager: true, ...CREATED_BY_SELECT },
  leads: { assignee: true, ...CREATED_BY_SELECT },
  students: { partner: true, center: true, assignee: true, lead: true, ...CREATED_BY_SELECT },
  documentItems: { student: true, ...CREATED_BY_SELECT },
  tasks: { department: true, assignee: true, student: true, ...CREATED_BY_SELECT },
  invoices: { student: true, payments: true, ...CREATED_BY_SELECT },
  payments: { invoice: { include: { student: true } }, ...CREATED_BY_SELECT },
  deals: { student: true, owner: true, ...CREATED_BY_SELECT },
  campaigns: { ...CREATED_BY_SELECT },
  inventoryItems: { ...CREATED_BY_SELECT },
  inventoryTransactions: { item: true, employee: true, ...CREATED_BY_SELECT },
};

export function getDelegate(entityKey: string) {
  const delegate = DELEGATES[entityKey];
  if (!delegate) throw new Error(`Entity không tồn tại: ${entityKey}`);
  return delegate;
}

export function getInclude(entityKey: string) {
  return INCLUDES[entityKey];
}

// Nhãn hiển thị dùng cho dropdown quan hệ (/api/options/[entity]).
export function labelForRecord(entityKey: string, record: any): string {
  switch (entityKey) {
    case "invoices":
      return `${record.student?.name ?? "?"} - ${record.type} - ${record.amount}đ`;
    case "inventoryTransactions":
      return `${record.item?.name ?? "?"} (${record.type})`;
    case "tasks":
      return record.title;
    case "users":
      return `${record.name} (${record.email})`;
    default:
      return record.name ?? record.title ?? record.id;
  }
}

const NUMBER_TYPES = new Set(["number"]);
const DATE_TYPES = new Set(["date"]);

// Chuyển payload thô (từ JSON body) thành dữ liệu Prisma theo field config của entity.
export async function coerceInput(entityKey: string, fields: FieldConfig[], body: Record<string, any>) {
  const data: Record<string, any> = {};

  for (const field of fields) {
    if (!(field.key in body)) continue;
    const raw = body[field.key];

    if (raw === "" || raw === null || raw === undefined) {
      data[field.key] = null;
      continue;
    }

    if (field.type === "relation") {
      data[field.key] = raw;
    } else if (NUMBER_TYPES.has(field.type)) {
      data[field.key] = Number(raw);
    } else if (DATE_TYPES.has(field.type)) {
      data[field.key] = new Date(raw);
    } else if (field.key === "active") {
      data[field.key] = raw === true || raw === "true";
    } else if (field.key === "password") {
      // xử lý riêng bên dưới cho entity `users`
      continue;
    } else {
      data[field.key] = raw;
    }
  }

  if (entityKey === "users" && body.password) {
    data.passwordHash = await hashPassword(String(body.password));
  }

  return data;
}

export function entityFields(entityKey: string): FieldConfig[] {
  const entity = getEntity(entityKey);
  if (!entity) throw new Error(`Entity không tồn tại: ${entityKey}`);
  return entity.fields;
}
