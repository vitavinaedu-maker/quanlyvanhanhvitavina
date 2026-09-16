// Phân quyền theo dữ liệu (row-level): nhiều tài khoản cùng nhập liệu nhưng
// STAFF chỉ thấy/sửa được dữ liệu của mình, MANAGER thấy theo phòng ban,
// ADMIN thấy toàn bộ. Áp dụng cho các entity có khái niệm "người phụ trách".
import { prisma } from "./prisma";
import type { SessionPayload } from "./auth";

export const SCOPED_ENTITIES: Record<string, { assigneeField: string }> = {
  leads: { assigneeField: "assigneeId" },
  students: { assigneeField: "assigneeId" },
  tasks: { assigneeField: "assigneeId" },
  deals: { assigneeField: "ownerId" },
};

function relationKey(assigneeField: string) {
  return assigneeField.endsWith("Id") ? assigneeField.slice(0, -2) : assigneeField;
}

async function getCurrentEmployee(userId: string) {
  return prisma.employee.findUnique({ where: { userId } });
}

// Trả về mệnh đề `where` bổ sung cho danh sách (GET). `undefined` nghĩa là không giới hạn.
export async function getScopeWhere(entityKey: string, session: SessionPayload) {
  const scoped = SCOPED_ENTITIES[entityKey];
  if (!scoped || session.role === "ADMIN") return undefined;

  const employee = await getCurrentEmployee(session.userId);
  const relKey = relationKey(scoped.assigneeField);

  if (session.role === "MANAGER") {
    if (!employee?.departmentId) {
      return { [scoped.assigneeField]: null };
    }
    return {
      OR: [{ [relKey]: { departmentId: employee.departmentId } }, { [scoped.assigneeField]: null }],
    };
  }

  // STAFF: chỉ thấy bản ghi của mình hoặc chưa được phân công (để có thể nhận việc).
  return {
    OR: [{ [scoped.assigneeField]: employee?.id ?? "__none__" }, { [scoped.assigneeField]: null }],
  };
}

// Kiểm tra quyền sửa/xoá một bản ghi cụ thể (PATCH/DELETE). `record` cần include quan hệ assignee.
export async function canMutateRecord(entityKey: string, session: SessionPayload, record: any) {
  const scoped = SCOPED_ENTITIES[entityKey];
  if (!scoped || session.role === "ADMIN") return true;

  const assigneeId = record[scoped.assigneeField];
  if (!assigneeId) return true; // chưa phân công -> ai cũng có thể nhận xử lý

  const employee = await getCurrentEmployee(session.userId);

  if (session.role === "MANAGER") {
    const relKey = relationKey(scoped.assigneeField);
    const assignee = record[relKey];
    return !!employee?.departmentId && assignee?.departmentId === employee.departmentId;
  }

  return assigneeId === employee?.id;
}
