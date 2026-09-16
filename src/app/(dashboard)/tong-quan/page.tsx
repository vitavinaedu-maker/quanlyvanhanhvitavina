import { prisma } from "@/lib/prisma";
import StatCard from "@/components/StatCard";

export default async function TongQuanPage() {
  const [studentCount, leadCount, taskOpen, invoiceUnpaid, employeeCount, inventoryItems] = await Promise.all([
    prisma.student.count(),
    prisma.lead.count({ where: { stage: { not: "HUY" } } }),
    prisma.task.count({ where: { status: { in: ["CAN_LAM", "DANG_LAM"] } } }),
    prisma.invoice.count({ where: { status: { in: ["CHUA_THANH_TOAN", "THANH_TOAN_MOT_PHAN"] } } }),
    prisma.employee.count({ where: { status: "DANG_LAM_VIEC" } }),
    prisma.inventoryItem.findMany(),
  ]);
  const lowStockCount = inventoryItems.filter((i) => i.quantity <= i.minQuantity).length;

  const [duHoc, duHocNghe] = await Promise.all([
    prisma.student.count({ where: { programType: "DU_HOC" } }),
    prisma.student.count({ where: { programType: "DU_HOC_NGHE" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Tổng quan</h1>
        <p className="text-sm text-gray-500">Số liệu vận hành toàn công ty Vita Vina</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Học viên" value={studentCount} hint={`${duHoc} du học / ${duHocNghe} du học nghề`} />
        <StatCard label="Lead CRM đang xử lý" value={leadCount} />
        <StatCard label="Công việc chưa xong" value={taskOpen} />
        <StatCard label="Hoá đơn chưa thu đủ" value={invoiceUnpaid} />
        <StatCard label="Nhân sự đang làm việc" value={employeeCount} />
        <StatCard label="Vật tư sắp hết" value={lowStockCount} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-medium text-gray-800 mb-2">Lối tắt</h2>
          <ul className="text-sm text-brand-700 space-y-1">
            <li><a className="hover:underline" href="/crm">Thêm lead mới (CRM)</a></li>
            <li><a className="hover:underline" href="/du-hoc/ho-so">Quản lý hồ sơ Du học</a></li>
            <li><a className="hover:underline" href="/du-hoc-nghe/ho-so">Quản lý hồ sơ Du học nghề</a></li>
            <li><a className="hover:underline" href="/nhan-su/cong-viec">Giao việc cho nhân viên</a></li>
            <li><a className="hover:underline" href="/tai-chinh">Theo dõi thu học phí</a></li>
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="font-medium text-gray-800 mb-2">Ghi chú</h2>
          <p className="text-sm text-gray-500">
            Đây là bản MVP đầy đủ các phân hệ theo mô tả (CRM, Du học, Du học nghề, Nhân sự, Đối
            tác, Tài chính, Kinh doanh, Marketing tự động, Kho). Có thể mở rộng thêm nghiệp vụ chi
            tiết cho từng phòng ban theo yêu cầu thực tế tiếp theo.
          </p>
        </div>
      </div>
    </div>
  );
}
