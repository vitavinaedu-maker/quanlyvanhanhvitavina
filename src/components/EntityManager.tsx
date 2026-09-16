"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { ENTITIES, type FieldConfig } from "@/lib/entities";

type Option = { id: string; label: string };

function relationObjectKey(fieldKey: string) {
  return fieldKey.endsWith("Id") ? fieldKey.slice(0, -2) : fieldKey;
}

function toDateInputValue(v: any) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function formatCell(record: any, field: FieldConfig): string {
  const raw = record[field.key];
  if (field.type === "relation") {
    const rel = record[relationObjectKey(field.key)];
    if (rel) return rel.name ?? rel.title ?? rel.email ?? rel.id;
    return raw ? "—" : "";
  }
  if (field.type === "select" && field.options) {
    const opt = field.options.find((o) => o.value === String(raw));
    if (opt) return opt.label;
  }
  if (field.type === "date") {
    return raw ? new Date(raw).toLocaleDateString("vi-VN") : "";
  }
  if (field.type === "number") {
    return raw !== null && raw !== undefined ? Number(raw).toLocaleString("vi-VN") : "";
  }
  if (raw === null || raw === undefined) return "";
  return String(raw);
}

export default function EntityManager({
  entityKey,
  title,
  filterBy,
  extraDefaults,
}: {
  entityKey: string;
  title?: string;
  filterBy?: { key: string; value: string };
  extraDefaults?: Record<string, any>;
}) {
  const filter = useMemo(
    () => (filterBy ? (r: any) => String(r[filterBy.key]) === filterBy.value : undefined),
    [filterBy?.key, filterBy?.value]
  );
  const config = ENTITIES[entityKey];
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relationOptions, setRelationOptions] = useState<Record<string, Option[]>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const relationEntities = useMemo(
    () =>
      Array.from(
        new Set(config.fields.filter((f) => f.type === "relation").map((f) => f.relationEntity!))
      ),
    [config]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/data/${entityKey}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setRecords(filter ? json.data.filter(filter) : json.data);
    } catch (err: any) {
      setError(err.message ?? "Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [entityKey, filter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    relationEntities.forEach(async (rel) => {
      const res = await fetch(`/api/options/${rel}`);
      if (!res.ok) return;
      const json = await res.json();
      setRelationOptions((prev) => ({ ...prev, [rel]: json.data }));
    });
  }, [relationEntities]);

  function openCreate() {
    const defaults: Record<string, any> = { ...extraDefaults };
    setEditing(null);
    setFormValues(defaults);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(record: any) {
    const values: Record<string, any> = {};
    for (const field of config.fields) {
      if (field.type === "date") values[field.key] = toDateInputValue(record[field.key]);
      else if (field.key === "password") values[field.key] = "";
      else values[field.key] = record[field.key] ?? "";
    }
    setEditing(record);
    setFormValues(values);
    setFormError(null);
    setFormOpen(true);
  }

  async function onDelete(record: any) {
    if (!confirm("Xoá bản ghi này? Hành động không thể hoàn tác.")) return;
    const res = await fetch(`/api/data/${entityKey}/${record.id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error ?? "Không thể xoá");
      return;
    }
    load();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const url = editing ? `/api/data/${entityKey}/${editing.id}` : `/api/data/${entityKey}`;
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Không thể lưu");
      setFormOpen(false);
      load();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const tableFields = config.fields.filter((f) => f.showInTable);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title ?? config.label}</h2>
        <button className="btn-primary" onClick={openCreate}>
          + Thêm {config.labelSingular.toLowerCase()}
        </button>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Đang tải...</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : records.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">Chưa có dữ liệu. Hãy thêm bản ghi đầu tiên.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                {tableFields.map((f) => (
                  <th key={f.key} className="px-4 py-2 text-left font-medium">
                    {f.label}
                  </th>
                ))}
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  {tableFields.map((f) => (
                    <td key={f.key} className="px-4 py-2 text-gray-700 whitespace-nowrap">
                      {formatCell(record, f)}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <button
                      className="text-brand-600 hover:underline text-xs mr-3"
                      onClick={() => openEdit(record)}
                    >
                      Sửa
                    </button>
                    <button
                      className="text-red-600 hover:underline text-xs"
                      onClick={() => onDelete(record)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              {editing ? `Sửa ${config.labelSingular.toLowerCase()}` : `Thêm ${config.labelSingular.toLowerCase()}`}
            </h3>
            <form onSubmit={onSubmit} className="space-y-4">
              {config.fields.map((field) => (
                <div key={field.key}>
                  <label className="label">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      className="input"
                      rows={3}
                      value={formValues[field.key] ?? ""}
                      onChange={(e) => setFormValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    />
                  ) : field.type === "select" ? (
                    <select
                      className="input"
                      required={field.required}
                      value={formValues[field.key] ?? ""}
                      onChange={(e) => setFormValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    >
                      <option value="">-- Chọn --</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "relation" ? (
                    <select
                      className="input"
                      required={field.required}
                      value={formValues[field.key] ?? ""}
                      onChange={(e) => setFormValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    >
                      <option value="">-- Chọn --</option>
                      {(relationOptions[field.relationEntity!] ?? []).map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="input"
                      type={field.type === "password" ? "password" : field.type}
                      required={field.required && !(editing && field.type === "password")}
                      placeholder={editing && field.type === "password" ? "Để trống nếu không đổi" : undefined}
                      value={formValues[field.key] ?? ""}
                      onChange={(e) => setFormValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn-secondary" onClick={() => setFormOpen(false)}>
                  Huỷ
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
