import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getEntity } from "@/lib/entities";
import { getDelegate, getInclude, coerceInput, entityFields } from "@/lib/entity-server";
import { SCOPED_ENTITIES, canMutateRecord } from "@/lib/scope";
import { canAccessModule, moduleForEntity } from "@/lib/rbac";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { entity, id } = await params;
  const config = getEntity(entity);
  if (!config) return NextResponse.json({ error: "Không tìm thấy module" }, { status: 404 });

  const moduleKey = moduleForEntity(entity);
  if (moduleKey && !canAccessModule(session.role, moduleKey)) {
    return NextResponse.json({ error: "Bạn không có quyền truy cập" }, { status: 403 });
  }

  const body = await req.json();

  try {
    const delegate = getDelegate(entity);

    if (SCOPED_ENTITIES[entity]) {
      const existing = await delegate.findUnique({ where: { id }, include: getInclude(entity) });
      if (!existing) return NextResponse.json({ error: "Không tìm thấy bản ghi" }, { status: 404 });
      if (!(await canMutateRecord(entity, session, existing))) {
        return NextResponse.json({ error: "Bạn không có quyền sửa bản ghi này" }, { status: 403 });
      }
    }

    const data = await coerceInput(entity, entityFields(entity), body);
    const record = await delegate.update({ where: { id }, data, include: getInclude(entity) });
    return NextResponse.json({ data: record });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Không thể cập nhật" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { entity, id } = await params;
  const config = getEntity(entity);
  if (!config) return NextResponse.json({ error: "Không tìm thấy module" }, { status: 404 });

  const moduleKey = moduleForEntity(entity);
  if (moduleKey && !canAccessModule(session.role, moduleKey)) {
    return NextResponse.json({ error: "Bạn không có quyền truy cập" }, { status: 403 });
  }

  try {
    const delegate = getDelegate(entity);

    if (SCOPED_ENTITIES[entity]) {
      const existing = await delegate.findUnique({ where: { id }, include: getInclude(entity) });
      if (!existing) return NextResponse.json({ error: "Không tìm thấy bản ghi" }, { status: 404 });
      if (!(await canMutateRecord(entity, session, existing))) {
        return NextResponse.json({ error: "Bạn không có quyền xoá bản ghi này" }, { status: 403 });
      }
    }

    await delegate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Không thể xoá (có thể đang được tham chiếu)" }, { status: 400 });
  }
}
