import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDelegate, labelForRecord, getInclude } from "@/lib/entity-server";

// Trả về danh sách rút gọn {id, label} để đổ vào dropdown quan hệ.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { entity } = await params;
  try {
    const delegate = getDelegate(entity);
    const records = await delegate.findMany({ include: getInclude(entity), orderBy: { id: "desc" } });
    const options = records.map((r: any) => ({ id: r.id, label: labelForRecord(entity, r) }));
    return NextResponse.json({ data: options });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Lỗi truy vấn" }, { status: 500 });
  }
}
