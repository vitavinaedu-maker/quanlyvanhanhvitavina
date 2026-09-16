import Tabs from "@/components/Tabs";
import EntityManager from "@/components/EntityManager";

export default function TaiChinhPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Tài chính</h1>
      <Tabs
        tabs={[
          { label: "Hoá đơn", content: <EntityManager entityKey="invoices" title="Hoá đơn" /> },
          { label: "Thanh toán", content: <EntityManager entityKey="payments" title="Thanh toán" /> },
        ]}
      />
    </div>
  );
}
