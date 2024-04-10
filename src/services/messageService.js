import { apiPrivate } from "./api"

export async function getConversations(keyword) {
  const { data } = await apiPrivate.get(
    `/conversation/getConversations/${keyword}`,
  )

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return data
}

export async function getMessages(conversationId, page = 1, limit = 20) {
  const { data } = await apiPrivate.get(
    `/conversation/getMessages/${conversationId}/${page}/${limit}`,
  )

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return data
}

export async function sendMessage(receiverId, content) {
  const { data } = await apiPrivate.post("/message/sendMessage", {
    receiverId,
    content,
  })

  return data.newMessage
}
