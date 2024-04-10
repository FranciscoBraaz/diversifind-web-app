import { apiPrivate } from "./api"

export async function getSkillsByProfessionalArea(url) {
  const { data } = await apiPrivate.get(`/skill/${url}`)

  const options = data.map((area) => ({
    label: area.name,
    value: area._id,
  }))

  return options
}
