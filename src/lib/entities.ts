// Registry cấu hình cho các module CRUD dùng chung (client-safe: không import Prisma).
import {
  toOptions,
  PROGRAM_TYPE_LABELS,
  LEAD_STAGE_LABELS,
  STUDENT_STATUS_LABELS,
  DOCUMENT_STATUS_LABELS,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
  PARTNER_TYPE_LABELS,
  PARTNER_STATUS_LABELS,
  INVOICE_TYPE_LABELS,
  INVOICE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  DEAL_STAGE_LABELS,
  CAMPAIGN_CHANNEL_LABELS,
  CAMPAIGN_STATUS_LABELS,
  INVENTORY_TXN_TYPE_LABELS,
  ROLE_LABELS,
} from "./enums";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "relation"
  | "email"
  | "password";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  relationEntity?: string; // dùng khi type === "relation"
  showInTable?: boolean;
  hideOnCreate?: boolean;
};

export type EntityConfig = {
  key: string; // khớp với route API /api/data/[entity]
  label: string;
  labelSingular: string;
  fields: FieldConfig[];
};

export const ENTITIES: Record<string, EntityConfig> = {
  departments: {
    key: "departments",
    label: "Phòng ban",
    labelSingular: "Phòng ban",
    fields: [
      { key: "code", label: "Mã phòng ban", type: "text", required: true, showInTable: true },
      { key: "name", label: "Tên phòng ban", type: "text", required: true, showInTable: true },
    ],
  },
  users: {
    key: "users",
    label: "Tài khoản",
    labelSingular: "Tài khoản",
    fields: [
      { key: "name", label: "Họ tên", type: "text", required: true, showInTable: true },
      { key: "email", label: "Email đăng nhập", type: "email", required: true, showInTable: true },
      { key: "password", label: "Mật khẩu", type: "password", required: true, hideOnCreate: false },
      { key: "role", label: "Vai trò", type: "select", required: true, options: toOptions(ROLE_LABELS), showInTable: true },
      {
        key: "active",
        label: "Đang hoạt động",
        type: "select",
        options: [
          { value: "true", label: "Hoạt động" },
          { value: "false", label: "Khoá" },
        ],
        showInTable: true,
      },
    ],
  },
  employees: {
    key: "employees",
    label: "Nhân sự",
    labelSingular: "Nhân viên",
    fields: [
      { key: "name", label: "Họ tên", type: "text", required: true, showInTable: true },
      { key: "email", label: "Email", type: "email", showInTable: true },
      { key: "phone", label: "Điện thoại", type: "text", showInTable: true },
      { key: "position", label: "Chức danh", type: "text", showInTable: true },
      { key: "departmentId", label: "Phòng ban", type: "relation", relationEntity: "departments", showInTable: true },
      {
        key: "userId",
        label: "Tài khoản đăng nhập",
        type: "relation",
        relationEntity: "users",
        showInTable: true,
      },
      {
        key: "status",
        label: "Trạng thái",
        type: "select",
        options: [
          { value: "DANG_LAM_VIEC", label: "Đang làm việc" },
          { value: "NGHI_VIEC", label: "Đã nghỉ việc" },
        ],
        showInTable: true,
      },
      { key: "hireDate", label: "Ngày vào làm", type: "date" },
    ],
  },
  partners: {
    key: "partners",
    label: "Đối tác",
    labelSingular: "Đối tác",
    fields: [
      { key: "name", label: "Tên đối tác", type: "text", required: true, showInTable: true },
      { key: "type", label: "Loại đối tác", type: "select", required: true, options: toOptions(PARTNER_TYPE_LABELS), showInTable: true },
      { key: "country", label: "Quốc gia", type: "text", showInTable: true },
      { key: "contactName", label: "Người liên hệ", type: "text" },
      { key: "contactEmail", label: "Email liên hệ", type: "email" },
      { key: "contactPhone", label: "SĐT liên hệ", type: "text" },
      { key: "status", label: "Trạng thái", type: "select", options: toOptions(PARTNER_STATUS_LABELS), showInTable: true },
      { key: "notes", label: "Ghi chú", type: "textarea" },
    ],
  },
  centers: {
    key: "centers",
    label: "Trung tâm du học",
    labelSingular: "Trung tâm",
    fields: [
      { key: "name", label: "Tên trung tâm", type: "text", required: true, showInTable: true },
      { key: "programType", label: "Chương trình", type: "select", required: true, options: toOptions(PROGRAM_TYPE_LABELS), showInTable: true },
      { key: "address", label: "Địa chỉ", type: "text" },
      { key: "phone", label: "Điện thoại", type: "text" },
      { key: "managerId", label: "Quản lý trung tâm", type: "relation", relationEntity: "employees", showInTable: true },
      {
        key: "status",
        label: "Trạng thái",
        type: "select",
        options: [
          { value: "HOAT_DONG", label: "Hoạt động" },
          { value: "NGUNG", label: "Ngừng hoạt động" },
        ],
        showInTable: true,
      },
    ],
  },
  leads: {
    key: "leads",
    label: "CRM - Khách hàng tiềm năng",
    labelSingular: "Lead",
    fields: [
      { key: "name", label: "Họ tên", type: "text", required: true, showInTable: true },
      { key: "phone", label: "Điện thoại", type: "text", required: true, showInTable: true },
      { key: "email", label: "Email", type: "email" },
      { key: "source", label: "Nguồn", type: "text", showInTable: true },
      { key: "programType", label: "Chương trình quan tâm", type: "select", required: true, options: toOptions(PROGRAM_TYPE_LABELS), showInTable: true },
      { key: "stage", label: "Giai đoạn", type: "select", options: toOptions(LEAD_STAGE_LABELS), showInTable: true },
      { key: "assigneeId", label: "Nhân viên phụ trách", type: "relation", relationEntity: "employees", showInTable: true },
      { key: "notes", label: "Ghi chú", type: "textarea" },
    ],
  },
  students: {
    key: "students",
    label: "Hồ sơ học viên",
    labelSingular: "Học viên",
    fields: [
      { key: "name", label: "Họ tên", type: "text", required: true, showInTable: true },
      { key: "dob", label: "Ngày sinh", type: "date" },
      { key: "phone", label: "Điện thoại", type: "text", showInTable: true },
      { key: "email", label: "Email", type: "email" },
      { key: "programType", label: "Chương trình", type: "select", required: true, options: toOptions(PROGRAM_TYPE_LABELS), showInTable: true },
      { key: "status", label: "Trạng thái hồ sơ", type: "select", options: toOptions(STUDENT_STATUS_LABELS), showInTable: true },
      { key: "partnerId", label: "Trường / đối tác", type: "relation", relationEntity: "partners" },
      { key: "centerId", label: "Trung tâm phụ trách", type: "relation", relationEntity: "centers", showInTable: true },
      { key: "assigneeId", label: "Nhân viên phụ trách", type: "relation", relationEntity: "employees", showInTable: true },
      { key: "notes", label: "Ghi chú", type: "textarea" },
    ],
  },
  documentItems: {
    key: "documentItems",
    label: "Hồ sơ giấy tờ",
    labelSingular: "Giấy tờ",
    fields: [
      { key: "studentId", label: "Học viên", type: "relation", relationEntity: "students", required: true, showInTable: true },
      { key: "name", label: "Tên giấy tờ", type: "text", required: true, showInTable: true },
      { key: "status", label: "Trạng thái", type: "select", options: toOptions(DOCUMENT_STATUS_LABELS), showInTable: true },
      { key: "dueDate", label: "Hạn nộp", type: "date", showInTable: true },
      { key: "notes", label: "Ghi chú", type: "textarea" },
    ],
  },
  tasks: {
    key: "tasks",
    label: "Công việc / Workflow",
    labelSingular: "Công việc",
    fields: [
      { key: "title", label: "Tên công việc", type: "text", required: true, showInTable: true },
      { key: "description", label: "Mô tả", type: "textarea" },
      { key: "departmentId", label: "Phòng ban", type: "relation", relationEntity: "departments", showInTable: true },
      { key: "assigneeId", label: "Người thực hiện", type: "relation", relationEntity: "employees", showInTable: true },
      { key: "studentId", label: "Học viên liên quan", type: "relation", relationEntity: "students" },
      { key: "status", label: "Trạng thái", type: "select", options: toOptions(TASK_STATUS_LABELS), showInTable: true },
      { key: "priority", label: "Độ ưu tiên", type: "select", options: toOptions(TASK_PRIORITY_LABELS), showInTable: true },
      { key: "dueDate", label: "Hạn hoàn thành", type: "date", showInTable: true },
    ],
  },
  invoices: {
    key: "invoices",
    label: "Hoá đơn",
    labelSingular: "Hoá đơn",
    fields: [
      { key: "studentId", label: "Học viên", type: "relation", relationEntity: "students", required: true, showInTable: true },
      { key: "type", label: "Loại phí", type: "select", required: true, options: toOptions(INVOICE_TYPE_LABELS), showInTable: true },
      { key: "amount", label: "Số tiền (VNĐ)", type: "number", required: true, showInTable: true },
      { key: "status", label: "Trạng thái", type: "select", options: toOptions(INVOICE_STATUS_LABELS), showInTable: true },
      { key: "issuedDate", label: "Ngày phát hành", type: "date" },
      { key: "dueDate", label: "Hạn thanh toán", type: "date", showInTable: true },
      { key: "notes", label: "Ghi chú", type: "textarea" },
    ],
  },
  payments: {
    key: "payments",
    label: "Thanh toán",
    labelSingular: "Thanh toán",
    fields: [
      { key: "invoiceId", label: "Hoá đơn", type: "relation", relationEntity: "invoices", required: true, showInTable: true },
      { key: "amount", label: "Số tiền (VNĐ)", type: "number", required: true, showInTable: true },
      { key: "method", label: "Hình thức", type: "select", options: toOptions(PAYMENT_METHOD_LABELS), showInTable: true },
      { key: "paidAt", label: "Ngày thanh toán", type: "date", showInTable: true },
      { key: "notes", label: "Ghi chú", type: "textarea" },
    ],
  },
  deals: {
    key: "deals",
    label: "Cơ hội kinh doanh",
    labelSingular: "Cơ hội",
    fields: [
      { key: "studentId", label: "Học viên liên quan", type: "relation", relationEntity: "students" },
      { key: "ownerId", label: "Nhân viên kinh doanh", type: "relation", relationEntity: "employees", showInTable: true },
      { key: "value", label: "Giá trị (VNĐ)", type: "number", required: true, showInTable: true },
      { key: "stage", label: "Giai đoạn", type: "select", options: toOptions(DEAL_STAGE_LABELS), showInTable: true },
      { key: "closeDate", label: "Ngày dự kiến chốt", type: "date", showInTable: true },
      { key: "notes", label: "Ghi chú", type: "textarea" },
    ],
  },
  campaigns: {
    key: "campaigns",
    label: "Chiến dịch Marketing",
    labelSingular: "Chiến dịch",
    fields: [
      { key: "name", label: "Tên chiến dịch", type: "text", required: true, showInTable: true },
      { key: "channel", label: "Kênh", type: "select", required: true, options: toOptions(CAMPAIGN_CHANNEL_LABELS), showInTable: true },
      { key: "status", label: "Trạng thái", type: "select", options: toOptions(CAMPAIGN_STATUS_LABELS), showInTable: true },
      { key: "startDate", label: "Ngày bắt đầu", type: "date", showInTable: true },
      { key: "endDate", label: "Ngày kết thúc", type: "date" },
      { key: "audience", label: "Đối tượng mục tiêu", type: "text" },
      { key: "content", label: "Nội dung", type: "textarea" },
    ],
  },
  inventoryItems: {
    key: "inventoryItems",
    label: "Kho - Danh mục vật tư",
    labelSingular: "Vật tư",
    fields: [
      { key: "name", label: "Tên vật tư", type: "text", required: true, showInTable: true },
      { key: "sku", label: "Mã SKU", type: "text", required: true, showInTable: true },
      { key: "unit", label: "Đơn vị tính", type: "text", showInTable: true },
      { key: "quantity", label: "Số lượng tồn", type: "number", showInTable: true },
      { key: "minQuantity", label: "Tồn tối thiểu", type: "number" },
      { key: "location", label: "Vị trí lưu kho", type: "text" },
    ],
  },
  inventoryTransactions: {
    key: "inventoryTransactions",
    label: "Kho - Phiếu nhập/xuất",
    labelSingular: "Phiếu kho",
    fields: [
      { key: "itemId", label: "Vật tư", type: "relation", relationEntity: "inventoryItems", required: true, showInTable: true },
      { key: "type", label: "Loại phiếu", type: "select", required: true, options: toOptions(INVENTORY_TXN_TYPE_LABELS), showInTable: true },
      { key: "quantity", label: "Số lượng", type: "number", required: true, showInTable: true },
      { key: "reason", label: "Lý do", type: "text", showInTable: true },
      { key: "employeeId", label: "Người thực hiện", type: "relation", relationEntity: "employees" },
    ],
  },
};

export function getEntity(key: string): EntityConfig | undefined {
  return ENTITIES[key];
}
