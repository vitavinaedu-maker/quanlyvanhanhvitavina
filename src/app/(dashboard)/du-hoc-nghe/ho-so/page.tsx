import EntityManager from "@/components/EntityManager";

export default function HoSoDuHocNghePage() {
  return (
    <EntityManager
      entityKey="students"
      title="Hồ sơ học viên - Du học nghề"
      filterBy={{ key: "programType", value: "DU_HOC_NGHE" }}
      extraDefaults={{ programType: "DU_HOC_NGHE" }}
    />
  );
}
