import { listProfessionalArea } from "../../../../../services/professionalAreaService"
import { getSkillsByProfessionalArea } from "../../../../../services/skillService"

export const descriptionFields = [
  {
    name: "occupationArea",
    type: "select",
    placeholder: "Selecione",
    label: "Área",
    options: [],
    required: true,
    dependencyFor: ["skills"],
    getOptions: listProfessionalArea,
    route: "list",
  },
  {
    name: "skills",
    type: "multi-select",
    placeholder: "Selecione",
    label: "Competências",
    options: [],
    required: true,
    dependentOn: "occupationArea",
    getOptions: getSkillsByProfessionalArea,
    route: "get-by-professional-area/paramValue",
  },
  {
    name: "description",
    type: "textarea",
    placeholder: "Fale um pouco sobre a vaga...",
    hasLabel: true,
    label: "Descrição da vaga",
    maxHeight: "calc(60vh - 90px)",
    rows: 10,
    required: true,
  },
]
