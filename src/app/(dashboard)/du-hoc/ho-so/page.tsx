import EntityManager from "@/components/EntityManager";

export default function HoSoDuHocPage() {
  return (
    <EntityManager
      entityKey="students"
      title="Hồ sơ học viên - Du học"
      filterBy={{ key: "programType", value: "DU_HOC" }}
      extraDefaults={{ programType: "DU_HOC" }}
    />
  );
}
