import Tabs from "@/components/Tabs";
import EntityManager from "@/components/EntityManager";

export default function CaiDatPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Cài đặt</h1>
      <Tabs
        tabs={[
          { label: "Phòng ban", content: <EntityManager entityKey="departments" title="Phòng ban" /> },
          { label: "Tài khoản người dùng", content: <EntityManager entityKey="users" title="Tài khoản" /> },
        ]}
      />
    </div>
  );
}
