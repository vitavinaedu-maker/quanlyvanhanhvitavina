#!/bin/sh
set -e

echo "Đồng bộ schema cơ sở dữ liệu (prisma db push)..."
npx prisma db push --skip-generate

if [ "$SEED_ON_START" = "true" ]; then
  echo "Seed dữ liệu mẫu ban đầu..."
  npx tsx prisma/seed.ts || echo "Seed bỏ qua (có thể đã có dữ liệu)."
fi

exec "$@"
