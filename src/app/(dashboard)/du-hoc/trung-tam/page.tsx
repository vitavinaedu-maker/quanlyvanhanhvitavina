import EntityManager from "@/components/EntityManager";

export default function TrungTamDuHocPage() {
  return (
    <EntityManager
      entityKey="centers"
      title="Trung tâm du học"
      filterBy={{ key: "programType", value: "DU_HOC" }}
      extraDefaults={{ programType: "DU_HOC" }}
    />
  );
}
