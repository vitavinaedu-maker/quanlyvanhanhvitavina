import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEPARTMENTS = [
  { code: "CRM", name: "CRM" },
  { code: "DU_HOC", name: "Du học" },
  { code: "DU_HOC_NGHE", name: "Du học nghề" },
  { code: "NHAN_SU", name: "Nhân sự" },
  { code: "DOI_TAC", name: "Đối tác" },
  { code: "TAI_CHINH", name: "Tài chính" },
  { code: "KINH_DOANH", name: "Kinh doanh" },
  { code: "MARKETING", name: "Marketing" },
  { code: "KHO", name: "Kho" },
];

async function main() {
  console.log("Seeding dữ liệu mẫu...");

  const departments: Record<string, { id: string }> = {};
  for (const dept of DEPARTMENTS) {
    departments[dept.code] = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept,
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "vitavinaedu@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "VitaVina@2026";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      name: "Quản trị viên Vita Vina",
      role: "ADMIN",
    },
  });

  const adminEmployee = await prisma.employee.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      name: "Quản trị viên Vita Vina",
      email: adminEmail,
      position: "Quản trị hệ thống",
      departmentId: departments.NHAN_SU.id,
    },
  });

  // Tài khoản demo có đăng nhập để test đa người dùng + phân quyền theo dữ liệu (RBAC theo hàng).
  const staffPasswordHash = await bcrypt.hash("Staff@2026", 10);
  const managerPasswordHash = await bcrypt.hash("Manager@2026", 10);

  const staffUser = await prisma.user.upsert({
    where: { email: "tuvan.demo@vitavina.com.vn" },
    update: {},
    create: {
      email: "tuvan.demo@vitavina.com.vn",
      passwordHash: staffPasswordHash,
      name: "Nguyễn Thị Tư Vấn",
      role: "STAFF",
    },
  });

  const managerUser = await prisma.user.upsert({
    where: { email: "kinhdoanh.demo@vitavina.com.vn" },
    update: {},
    create: {
      email: "kinhdoanh.demo@vitavina.com.vn",
      passwordHash: managerPasswordHash,
      name: "Trần Văn Kinh Doanh",
      role: "MANAGER",
    },
  });

  const tuVan = await prisma.employee.create({
    data: {
      userId: staffUser.id,
      name: "Nguyễn Thị Tư Vấn",
      email: "tuvan.demo@vitavina.com.vn",
      phone: "0900000001",
      position: "Chuyên viên tư vấn",
      departmentId: departments.DU_HOC.id,
    },
  });

  const saleNghe = await prisma.employee.create({
    data: {
      userId: managerUser.id,
      name: "Trần Văn Kinh Doanh",
      email: "kinhdoanh.demo@vitavina.com.vn",
      phone: "0900000002",
      position: "Trưởng nhóm kinh doanh",
      departmentId: departments.KINH_DOANH.id,
    },
  });

  const centerDuHoc = await prisma.center.create({
    data: {
      name: "Trung tâm Du học Vita Vina Hà Nội",
      programType: "DU_HOC",
      address: "Hà Nội",
      managerId: tuVan.id,
    },
  });

  const centerDuHocNghe = await prisma.center.create({
    data: {
      name: "Trung tâm Du học nghề Vita Vina Đức",
      programType: "DU_HOC_NGHE",
      address: "TP. Hồ Chí Minh",
      managerId: saleNghe.id,
    },
  });

  const partnerSchool = await prisma.partner.create({
    data: {
      name: "Trường Điều dưỡng Berlin",
      type: "TRUONG_DOI_TAC",
      country: "Đức",
      status: "DANG_HOP_TAC",
    },
  });

  const lead = await prisma.lead.create({
    data: {
      name: "Phạm Văn A",
      phone: "0912345678",
      email: "phamvana@example.com",
      source: "Zalo OA",
      programType: "DU_HOC_NGHE",
      stage: "DANG_TU_VAN",
      assigneeId: saleNghe.id,
    },
  });

  const student1 = await prisma.student.create({
    data: {
      leadId: lead.id,
      name: "Phạm Văn A",
      phone: "0912345678",
      email: "phamvana@example.com",
      programType: "DU_HOC_NGHE",
      status: "HOAN_THIEN_HO_SO",
      partnerId: partnerSchool.id,
      centerId: centerDuHocNghe.id,
      assigneeId: saleNghe.id,
    },
  });

  await prisma.student.create({
    data: {
      name: "Lê Thị B",
      phone: "0987654321",
      email: "lethib@example.com",
      programType: "DU_HOC",
      status: "CHO_VISA",
      centerId: centerDuHoc.id,
      assigneeId: tuVan.id,
    },
  });

  await prisma.documentItem.createMany({
    data: [
      { studentId: student1.id, name: "Hộ chiếu", status: "DA_DUYET" },
      { studentId: student1.id, name: "Bằng tốt nghiệp THPT", status: "DA_NOP" },
      { studentId: student1.id, name: "Chứng chỉ tiếng Đức B1", status: "THIEU" },
    ],
  });

  await prisma.task.create({
    data: {
      title: "Gọi điện xác nhận lịch phỏng vấn với học viên Phạm Văn A",
      departmentId: departments.DU_HOC_NGHE.id,
      assigneeId: saleNghe.id,
      studentId: student1.id,
      status: "CAN_LAM",
      priority: "CAO",
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      studentId: student1.id,
      type: "HOC_PHI",
      amount: 50000000,
      status: "THANH_TOAN_MOT_PHAN",
    },
  });

  await prisma.payment.create({
    data: { invoiceId: invoice.id, amount: 20000000, method: "CHUYEN_KHOAN" },
  });

  await prisma.deal.create({
    data: {
      studentId: student1.id,
      ownerId: saleNghe.id,
      value: 50000000,
      stage: "DANG_DAM_PHAN",
    },
  });

  await prisma.campaign.create({
    data: {
      name: "Zalo OA - Tuyển sinh Du học nghề Đức Q1",
      channel: "ZALO_OA",
      status: "DANG_CHAY",
      audience: "Học sinh THPT quan tâm ngành điều dưỡng",
    },
  });

  await prisma.inventoryItem.createMany({
    data: [
      { name: "Tờ rơi tuyển sinh Du học nghề Đức", sku: "TR-001", unit: "tờ", quantity: 500, minQuantity: 100 },
      { name: "Bút bi quà tặng", sku: "QT-001", unit: "cái", quantity: 50, minQuantity: 100 },
    ],
    skipDuplicates: true,
  });

  console.log("Seed hoàn tất.");
  console.log(`Đăng nhập admin: ${adminEmail} / ${adminPassword}`);
  console.log("Đăng nhập demo MANAGER (Kinh doanh): kinhdoanh.demo@vitavina.com.vn / Manager@2026");
  console.log("Đăng nhập demo STAFF (Du học): tuvan.demo@vitavina.com.vn / Staff@2026");
  console.log("*** Hãy đổi mật khẩu admin ngay sau khi đăng nhập lần đầu. ***");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
