import { apiPrivate } from "./api"

export async function listProfessionalArea(url) {
  const { data } = await apiPrivate.get(`/professional-area/${url}`)

  const options = data.map((area) => ({
    label: area.name,
    value: area._id,
  }))

  return options
}
