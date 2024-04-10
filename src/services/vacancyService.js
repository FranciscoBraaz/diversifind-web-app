import { apiPrivate } from "./api"

export async function getVacancies({ page = 1, filters = {}, keyword = "" }) {
  const { data } = await apiPrivate.post("/vacancy/list-vacancies", {
    page,
    filters,
    keyword,
  })

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1500)
  })

  return data
}

export async function getVacanciesByAuthor({
  page = 1,
  limit = 20,
  filters = {},
  keyword = "",
}) {
  const { data } = await apiPrivate.post("/vacancy/list-vacancies-by-author", {
    page,
    limit,
    filters,
    keyword,
  })

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1500)
  })

  return data
}

export async function getMyApplications({ page = 1, keyword = "" }) {
  const { data } = await apiPrivate.post("/vacancy/list-applications-by-user", {
    page,
    keyword,
  })

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1500)
  })

  return data
}

export async function getVacancy(vacancyId) {
  const { data } = await apiPrivate.get(`/vacancy/${vacancyId}`)

  await new Promise((resolve) => setTimeout(resolve, 1000))
  return data
}

export async function createVacancy(vacancy) {
  const { data } = await apiPrivate.post("/vacancy/create", vacancy)

  await new Promise((resolve) => setTimeout(resolve, 1000))
  return data
}

export async function editVacancy(vacancyId, vacancy) {
  const { data } = await apiPrivate.put("/vacancy/edit", {
    vacancyId,
    ...vacancy,
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))
  return data
}

export async function updateVacancy(vacancy) {
  const { data } = await apiPrivate.put("/vacancy/update", vacancy)

  await new Promise((resolve) => setTimeout(resolve, 1000))
  return data
}

export async function submitCandidature({ vacancyId, contactEmail }) {
  const { data } = await apiPrivate.post("/vacancy/apply", {
    vacancyId,
    contactEmail,
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return data
}

export async function getVacancyCandidates(vacancyId, page = 1) {
  const { data } = await apiPrivate.post(`/vacancy/candidates`, {
    vacancyId,
    page,
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return data
}

export async function deleteVacancy(vacancyId) {
  const { data } = await apiPrivate.delete(`/vacancy/delete/${vacancyId}`)

  await new Promise((resolve) => setTimeout(resolve, 1000))
  return data
}
