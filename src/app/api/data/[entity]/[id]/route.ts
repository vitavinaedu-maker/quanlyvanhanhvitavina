import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getEntity } from "@/lib/entities";
import { getDelegate, getInclude, coerceInput, entityFields } from "@/lib/entity-server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { entity, id } = await params;
  const config = getEntity(entity);
  if (!config) return NextResponse.json({ error: "Không tìm thấy module" }, { status: 404 });

  const body = await req.json();

  try {
    const delegate = getDelegate(entity);
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

  try {
    const delegate = getDelegate(entity);
    await delegate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Không thể xoá (có thể đang được tham chiếu)" }, { status: 400 });
  }
}
