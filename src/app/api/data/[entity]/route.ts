import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getEntity } from "@/lib/entities";
import { getDelegate, getInclude, coerceInput, entityFields, CREATED_BY_ENTITIES } from "@/lib/entity-server";
import { getScopeWhere } from "@/lib/scope";
import { canAccessModule, moduleForEntity } from "@/lib/rbac";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { entity } = await params;
  const config = getEntity(entity);
  if (!config) return NextResponse.json({ error: "Không tìm thấy module" }, { status: 404 });

  const moduleKey = moduleForEntity(entity);
  if (moduleKey && !canAccessModule(session.role, moduleKey)) {
    return NextResponse.json({ error: "Bạn không có quyền truy cập" }, { status: 403 });
  }

  try {
    const delegate = getDelegate(entity);
    const orderBy = config.fields.some((f) => f.key === "createdAt") || entity !== "documentItems"
      ? { id: "desc" as const }
      : undefined;
    const where = await getScopeWhere(entity, session);
    const records = await delegate.findMany({ where, include: getInclude(entity), orderBy });
    return NextResponse.json({ data: records });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Lỗi truy vấn dữ liệu" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { entity } = await params;
  const config = getEntity(entity);
  if (!config) return NextResponse.json({ error: "Không tìm thấy module" }, { status: 404 });

  const moduleKey = moduleForEntity(entity);
  if (moduleKey && !canAccessModule(session.role, moduleKey)) {
    return NextResponse.json({ error: "Bạn không có quyền truy cập" }, { status: 403 });
  }

  const body = await req.json();

  for (const field of config.fields) {
    if (field.required && !body[field.key] && field.key !== "password") {
      return NextResponse.json({ error: `Thiếu trường bắt buộc: ${field.label}` }, { status: 400 });
    }
  }
  if (entity === "users" && !body.password) {
    return NextResponse.json({ error: "Thiếu mật khẩu" }, { status: 400 });
  }

  try {
    const delegate = getDelegate(entity);
    const data = await coerceInput(entity, entityFields(entity), body);
    if (CREATED_BY_ENTITIES.has(entity)) {
      data.createdById = session.userId;
    }
    const record = await delegate.create({ data, include: getInclude(entity) });
    return NextResponse.json({ data: record }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Không thể tạo bản ghi" }, { status: 400 });
  }
}
