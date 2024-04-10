import { apiPrivate } from "./api"

export async function createCommunity(communityInfo) {
  await apiPrivate.post("community/create", {
    ...communityInfo,
  })
}

export async function editCommunity(communityId, communityInfo) {
  await apiPrivate.post("community/edit", {
    communityId,
    ...communityInfo,
  })
}

export async function getCommunities({ page, limit, filters, keyword }) {
  const { data } = await apiPrivate.post("community/list", {
    page,
    limit,
    filters,
    keyword,
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return data
}

export async function getCommunitiesByAuthor({
  page,
  limit,
  filters,
  keyword,
}) {
  const { data } = await apiPrivate.post("community/list-by-author", {
    page,
    limit,
    filters,
    keyword,
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return data
}

export async function deleteCommunity(communityId) {
  const { data } = await apiPrivate.delete(`/community/delete/${communityId}`)

  await new Promise((resolve) => setTimeout(resolve, 1000))
  return data
}

export async function rateCommunity(rating, communityId) {
  await apiPrivate.post(`/community/rate`, {
    rating,
    communityId,
  })
}
