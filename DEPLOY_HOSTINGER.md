# Hướng dẫn triển khai lên Hostinger VPS

## 1. Chọn & khởi tạo VPS

1. Vào [hPanel Hostinger](https://hpanel.hostinger.com) → mua gói **VPS** (khuyến nghị KVM 2:
   2 vCPU / 8GB RAM trở lên — đủ chạy Next.js + PostgreSQL cho công ty quy mô vừa; có thể bắt
   đầu KVM 1 rồi nâng cấp sau).
2. Khi khởi tạo, chọn hệ điều hành **Ubuntu 22.04 với Docker** (Hostinger có template cài sẵn
   Docker trong mục *OS with panel* / *Application*) để đỡ phải cài tay. Nếu không có template
   đó, chọn Ubuntu 22.04 thường rồi cài Docker ở bước 2 bên dưới.
3. Trỏ **domain/subdomain** (vd. `erp.vitavina.com.vn`) về IP của VPS bằng bản ghi DNS loại `A`
   trong phần quản lý domain (Hostinger hoặc nơi bạn mua domain).

## 2. Cài Docker (bỏ qua nếu VPS đã có sẵn)

SSH vào VPS rồi chạy:

```bash
curl -fsSL https://get.docker.com | sh
sudo systemctl enable --now docker
```

## 3. Lấy mã nguồn từ GitHub

```bash
sudo mkdir -p /opt/vitavina-erp && sudo chown $USER /opt/vitavina-erp
git clone https://github.com/<owner>/<repo>.git /opt/vitavina-erp
cd /opt/vitavina-erp
```

(Dùng đúng URL repo GitHub bạn đã publish ở bước trước.)

## 4. Cấu hình biến môi trường

```bash
cp .env.example .env
nano .env
```

Cần sửa tối thiểu:

- `POSTGRES_PASSWORD` — đặt mật khẩu DB mạnh, ngẫu nhiên
- `AUTH_SECRET` — chạy `openssl rand -base64 48` rồi dán vào
- `DOMAIN` — domain đã trỏ DNS ở bước 1 (vd. `erp.vitavina.com.vn`), **bắt buộc DNS đã trỏ xong
  trước khi bật Caddy để xin SSL tự động thành công**
- `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` — tài khoản quản trị đầu tiên
- `SEED_ON_START=true` — **chỉ bật ở lần chạy đầu tiên** để tạo dữ liệu mẫu + tài khoản admin,
  sau đó đổi lại `false` và deploy lại để tránh tạo trùng dữ liệu mỗi lần khởi động lại container

## 5. Chạy hệ thống

```bash
docker compose up -d --build
docker compose logs -f app   # theo dõi log, Ctrl+C để thoát khi thấy "Ready"
```

Sau khi container `app` báo sẵn sàng và `caddy` xin SSL xong (xem `docker compose logs caddy`),
truy cập `https://<DOMAIN>`.

Đăng nhập bằng tài khoản đã đặt ở `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`, sau đó vào
**Cài đặt → Tài khoản người dùng** để đổi mật khẩu và tạo tài khoản cho từng nhân viên/phòng ban.

Nhớ quay lại `.env`, đặt `SEED_ON_START=false`, rồi `docker compose up -d --build` lại lần nữa.

## 6. Tự động deploy khi push code (tuỳ chọn)

Trong repo GitHub, vào **Settings → Secrets and variables → Actions** và thêm:

| Secret         | Giá trị |
|----------------|---------|
| `VPS_HOST`     | IP hoặc domain VPS |
| `VPS_USER`     | user SSH (vd. `root` hoặc user riêng bạn tạo để deploy) |
| `VPS_SSH_KEY`  | private key SSH tương ứng public key đã thêm vào VPS (`~/.ssh/authorized_keys`) |
| `VPS_APP_PATH` | đường dẫn thư mục mã nguồn trên VPS, vd. `/opt/vitavina-erp` |

Từ lần push tiếp theo vào nhánh `main`, workflow `.github/workflows/deploy.yml` sẽ tự SSH vào
VPS, `git pull` và `docker compose up -d --build`.

## 7. Backup dữ liệu

Dữ liệu PostgreSQL nằm trong Docker volume `db_data`. Backup định kỳ bằng:

```bash
docker compose exec db pg_dump -U <POSTGRES_USER> <POSTGRES_DB> > backup-$(date +%F).sql
```

Nên đặt lệnh này vào cron chạy hằng ngày và lưu file backup ra nơi khác VPS (Google Drive, S3...).

## Sự cố thường gặp

- **Caddy không xin được SSL**: kiểm tra DNS `DOMAIN` đã trỏ đúng IP VPS (dùng `dig <domain>` để
  kiểm tra), và port 80/443 không bị firewall Hostinger chặn (mục *Firewall* trong hPanel).
- **App không kết nối được DB**: kiểm tra `docker compose ps` cả 3 service `db`, `app`, `caddy`
  đều ở trạng thái `Up`; xem `docker compose logs db`.
- **Muốn đổi cấu trúc dữ liệu (thêm cột/bảng)**: sửa `prisma/schema.prisma`, sau đó chạy lại
  `docker compose up -d --build` — entrypoint sẽ tự `prisma db push` đồng bộ schema.
