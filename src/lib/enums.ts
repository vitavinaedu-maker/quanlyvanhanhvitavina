// Nhãn tiếng Việt cho các enum dùng chung giữa client & server.

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Quản trị viên",
  MANAGER: "Quản lý",
  STAFF: "Nhân viên",
};

export const PROGRAM_TYPE_LABELS: Record<string, string> = {
  DU_HOC: "Du học",
  DU_HOC_NGHE: "Du học nghề",
};

export const LEAD_STAGE_LABELS: Record<string, string> = {
  MOI: "Mới",
  DA_LIEN_HE: "Đã liên hệ",
  DANG_TU_VAN: "Đang tư vấn",
  CHOT: "Chốt / chuyển hồ sơ",
  HUY: "Huỷ",
};

export const STUDENT_STATUS_LABELS: Record<string, string> = {
  TIEP_NHAN: "Tiếp nhận hồ sơ",
  HOAN_THIEN_HO_SO: "Hoàn thiện hồ sơ",
  NOP_HO_SO: "Nộp hồ sơ",
  CHO_VISA: "Chờ visa",
  DA_VISA: "Đã có visa",
  CHUAN_BI_XUAT_CANH: "Chuẩn bị xuất cảnh",
  DA_XUAT_CANH: "Đã xuất cảnh",
  DUNG: "Dừng / huỷ hồ sơ",
};

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  THIEU: "Thiếu",
  DA_NOP: "Đã nộp",
  DA_DUYET: "Đã duyệt",
  TU_CHOI: "Từ chối / cần bổ sung",
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  CAN_LAM: "Cần làm",
  DANG_LAM: "Đang làm",
  HOAN_THANH: "Hoàn thành",
  QUA_HAN: "Quá hạn",
};

export const TASK_PRIORITY_LABELS: Record<string, string> = {
  THAP: "Thấp",
  BINH_THUONG: "Bình thường",
  CAO: "Cao",
  KHAN_CAP: "Khẩn cấp",
};

export const PARTNER_TYPE_LABELS: Record<string, string> = {
  TRUONG_DOI_TAC: "Trường / cơ sở đào tạo",
  DAI_LY: "Đại lý / cộng tác viên",
  NHA_CUNG_CAP: "Nhà cung cấp dịch vụ",
};

export const PARTNER_STATUS_LABELS: Record<string, string> = {
  DANG_HOP_TAC: "Đang hợp tác",
  TAM_NGUNG: "Tạm ngưng",
  NGUNG_HOP_TAC: "Ngưng hợp tác",
};

export const INVOICE_TYPE_LABELS: Record<string, string> = {
  HOC_PHI: "Học phí",
  PHI_DICH_VU: "Phí dịch vụ",
  PHI_VISA: "Phí visa",
  KHAC: "Khác",
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  CHUA_THANH_TOAN: "Chưa thanh toán",
  THANH_TOAN_MOT_PHAN: "Thanh toán một phần",
  DA_THANH_TOAN: "Đã thanh toán",
  QUA_HAN: "Quá hạn",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  TIEN_MAT: "Tiền mặt",
  CHUYEN_KHOAN: "Chuyển khoản",
  THE: "Thẻ",
  KHAC: "Khác",
};

export const DEAL_STAGE_LABELS: Record<string, string> = {
  TIEM_NANG: "Tiềm năng",
  DANG_DAM_PHAN: "Đang đàm phán",
  DA_CHOT: "Đã chốt",
  THAT_BAI: "Thất bại",
};

export const CAMPAIGN_CHANNEL_LABELS: Record<string, string> = {
  ZALO_OA: "Zalo OA",
  EMAIL: "Email",
  SMS: "SMS",
  FACEBOOK: "Facebook",
  KHAC: "Khác",
};

export const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  NHAP: "Nháp",
  DANG_CHAY: "Đang chạy",
  TAM_DUNG: "Tạm dừng",
  KET_THUC: "Kết thúc",
};

export const INVENTORY_TXN_TYPE_LABELS: Record<string, string> = {
  NHAP: "Nhập kho",
  XUAT: "Xuất kho",
};

export function toOptions(labels: Record<string, string>) {
  return Object.entries(labels).map(([value, label]) => ({ value, label }));
}
