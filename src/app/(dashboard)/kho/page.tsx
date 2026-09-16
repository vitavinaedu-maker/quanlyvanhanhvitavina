import Tabs from "@/components/Tabs";
import EntityManager from "@/components/EntityManager";

export default function KhoPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Kho</h1>
      <Tabs
        tabs={[
          {
            label: "Hồ sơ giấy tờ học viên",
            content: <EntityManager entityKey="documentItems" title="Hồ sơ giấy tờ" />,
          },
          {
            label: "Danh mục vật tư",
            content: <EntityManager entityKey="inventoryItems" title="Danh mục vật tư" />,
          },
          {
            label: "Phiếu nhập / xuất kho",
            content: <EntityManager entityKey="inventoryTransactions" title="Phiếu nhập / xuất kho" />,
          },
        ]}
      />
    </div>
  );
}
