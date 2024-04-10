import { apiPrivate } from "./api"

export async function createPost(postFormData) {
  const { data } = await apiPrivate.post("posts/create", postFormData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return data
}

export async function editPost(postFormData) {
  const { data } = await apiPrivate.put("posts/edit", postFormData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return data
}

export async function getPosts(page) {
  const { data } = await apiPrivate.get(`posts/get-feed?page=${page}`)

  return data
}

export async function getPost(postId) {
  const { data } = await apiPrivate.get(`posts/get-post?postId=${postId}`)

  return data
}

export async function deletePost(postId) {
  const { data } = await apiPrivate.delete(`posts/remove-post?postId=${postId}`)

  return data
}

export async function addLike(postId) {
  const { data } = await apiPrivate.post(`likes/add-like`, {
    postId,
  })

  return data
}

export async function removeLike(postId, likeId) {
  const { data } = await apiPrivate.post(`likes/remove-like`, {
    postId,
    likeId,
  })

  return data
}

export async function addComment(postId, content) {
  const { data } = await apiPrivate.post(`comments/add-comment`, {
    postId,
    content,
  })

  return data
}

export async function getCommentsFromPost(postId, page) {
  const { data } = await apiPrivate.post(`comments/get-comments`, {
    postId,
    page,
  })

  return data
}

export async function deleteComment(commentId, postId) {
  const { data } = await apiPrivate.post(`comments/remove-comment`, {
    commentId,
    postId,
  })

  return data
}

export async function editComment(commentId, content) {
  const { data } = await apiPrivate.put(`comments/edit-comment`, {
    commentId,
    content,
  })

  return data
}
