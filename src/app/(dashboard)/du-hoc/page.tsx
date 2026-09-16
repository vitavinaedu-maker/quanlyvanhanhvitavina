import { prisma } from "@/lib/prisma";
import StatCard from "@/components/StatCard";
import { STUDENT_STATUS_LABELS } from "@/lib/enums";

export default async function TongQuanDuHocPage() {
  const students = await prisma.student.findMany({ where: { programType: "DU_HOC" } });
  const byStatus = Object.keys(STUDENT_STATUS_LABELS).map((status) => ({
    status,
    label: STUDENT_STATUS_LABELS[status],
    count: students.filter((s) => s.status === status).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Tổng quan Du học</h1>
        <p className="text-sm text-gray-500">Tổng {students.length} học viên chương trình Du học</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {byStatus.map((s) => (
          <StatCard key={s.status} label={s.label} value={s.count} />
        ))}
      </div>
      <div className="card p-5">
        <h2 className="font-medium text-gray-800 mb-2">Lối tắt</h2>
        <ul className="text-sm text-brand-700 space-y-1">
          <li><a className="hover:underline" href="/du-hoc/ho-so">Quản lý hồ sơ học viên Du học</a></li>
          <li><a className="hover:underline" href="/du-hoc/trung-tam">Quản lý trung tâm du học</a></li>
        </ul>
      </div>
    </div>
  );
}
