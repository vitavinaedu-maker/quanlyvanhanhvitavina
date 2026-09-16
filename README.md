# Vita Vina ERP

Phần mềm quản lý vận hành nội bộ cho công ty du học & du học nghề Vita Vina — lấy cảm hứng
từ cấu trúc nghiệp vụ của MOKACO ([mokaco.vn](https://mokaco.vn/)), bao gồm các phân hệ:

- **Tổng quan** — dashboard số liệu toàn công ty
- **CRM** — quản lý lead/khách hàng tiềm năng
- **Du học** — tổng quan, hồ sơ học viên, trung tâm du học
- **Du học nghề** — tổng quan, hồ sơ học viên
- **Nhân sự** — danh sách nhân viên, công việc/workflow theo phòng ban
- **Đối tác** — trường/đối tác nước ngoài, đại lý, nhà cung cấp
- **Tài chính** — hoá đơn, thanh toán học phí/dịch vụ
- **Kinh doanh** — cơ hội/hợp đồng
- **Marketing tự động** — chiến dịch Zalo OA / Email / SMS / Facebook
- **Kho** — hồ sơ giấy tờ học viên (checklist) và tồn kho vật tư (nhập/xuất)
- **Cài đặt** — phòng ban, tài khoản người dùng, phân quyền

## Công nghệ

- **Next.js 14** (App Router, TypeScript) — vừa là backend (API routes) vừa là frontend
- **PostgreSQL + Prisma ORM** — cơ sở dữ liệu quan hệ
- **Tailwind CSS** — giao diện
- Xác thực bằng JWT lưu trong cookie httpOnly (không dùng dịch vụ ngoài), phân quyền theo vai trò
  `ADMIN` / `MANAGER` / `STAFF` ở cấp module (xem `src/lib/rbac.ts`)
- Hầu hết các module dùng chung một cơ chế CRUD tổng quát (`src/lib/entities.ts` +
  `src/components/EntityManager.tsx` + `src/app/api/data/[entity]`) để thêm/sửa/xoá dữ liệu —
  giúp mở rộng thêm trường hoặc module mới nhanh chóng, nhất quán.

## Chạy dự án ở máy local

Yêu cầu: Node.js 22+, PostgreSQL (có thể chạy bằng Docker).

```bash
cp .env.example .env.local
# Sửa DATABASE_URL và AUTH_SECRET trong .env.local

npm install
npx prisma db push          # tạo schema trong database
npx tsx prisma/seed.ts      # tạo dữ liệu mẫu + tài khoản admin
npm run dev                 # http://localhost:3000
```

Tài khoản admin mặc định sau khi seed: xem log của lệnh seed (mặc định
`vitavinaedu@gmail.com` / mật khẩu đặt trong `SEED_ADMIN_PASSWORD`, hãy đổi ngay sau khi
đăng nhập lần đầu qua màn hình **Cài đặt → Tài khoản người dùng**).

## Triển khai lên Hostinger

Hệ thống cần Node.js + PostgreSQL chạy liên tục (không phải static site), nên **gói Shared/Business
Hosting thông thường của Hostinger (chỉ chạy PHP) không phù hợp**. Khuyến nghị dùng:

> **Hostinger VPS** (gói KVM 2 trở lên là đủ cho quy mô một công ty du học vừa) — có toàn quyền
> cài Docker, mở port, gắn domain riêng, SSL miễn phí.

Xem hướng dẫn triển khai chi tiết từng bước tại [`DEPLOY_HOSTINGER.md`](./DEPLOY_HOSTINGER.md).

Tóm tắt nhanh (đã cài Docker trên VPS):

```bash
git clone <repo-url> vitavina-erp && cd vitavina-erp
cp .env.example .env
# Sửa .env: POSTGRES_PASSWORD, AUTH_SECRET, DOMAIN, SEED_ADMIN_PASSWORD

docker compose up -d --build
```

Truy cập `https://<DOMAIN>` sau khi Caddy tự cấp SSL (thường mất 30–60 giây ở lần chạy đầu).

## CI/CD với GitHub

- `.github/workflows/ci.yml` — build & type-check mỗi khi push/PR.
- `.github/workflows/deploy.yml` — tự SSH vào VPS và `docker compose up -d --build` khi push vào
  nhánh `main`. Cần khai báo các secret `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_APP_PATH`
  trong **Settings → Secrets and variables → Actions** của repo GitHub.

## Cấu trúc thư mục

```
prisma/schema.prisma        Toàn bộ mô hình dữ liệu các phân hệ
src/lib/entities.ts         Cấu hình trường dữ liệu cho từng module (dùng chung UI+API)
src/lib/entity-server.ts    Ánh xạ entity -> Prisma model, include quan hệ
src/app/api/data/[entity]   API CRUD tổng quát cho mọi module
src/app/(dashboard)/...     Các trang theo đúng menu nghiệp vụ
src/components/EntityManager.tsx   Bảng danh sách + form thêm/sửa dùng chung
```

## Hướng mở rộng tiếp theo

Đây là bản MVP đầy đủ khung tất cả phân hệ với CRUD hoạt động thật (không phải giao diện tĩnh).
Các hướng có thể làm sâu hơn theo nhu cầu thực tế:

- Workflow nhiều bước có duyệt/chuyển trạng thái tự động theo phòng ban
- Tự động hoá Marketing thực sự (tích hợp Zalo OA, Email, SMS gửi hàng loạt)
- Phân quyền chi tiết theo từng trường dữ liệu, không chỉ theo module
- Báo cáo/biểu đồ nâng cao, xuất Excel
- Thông báo real-time, nhắc việc quá hạn
