import { apiPrivate, apiPublic } from "./api"

export async function signUpPerson({ name, email, password }) {
  const data = await apiPublic.post("users/sign-up-person", {
    name,
    email,
    password,
  })

  return data
}

export async function signUpCompany({
  name,
  email,
  password,
  city,
  stateUf,
  occupationArea,
  companyType,
  website,
}) {
  const data = await apiPublic.post("users/sign-up-company", {
    name,
    email,
    password,
    city,
    stateUf,
    occupationArea,
    companyType,
    website,
  })

  return data
}

export async function signIn({ email, password }) {
  const { data } = await apiPublic.post(
    "users/sign-in",
    {
      email,
      password,
    },
    {
      withCredentials: true,
    },
  )

  return data
}

export async function singOut() {
  await apiPublic.get("users/sign-out", {
    withCredentials: true,
  })
}

export async function resendConfirmationEmail({ email }) {
  const data = await apiPublic.post("users/resend-confirmation-email", {
    email,
  })

  return data
}

export async function confirmEmail({ token, signal }) {
  const data = await apiPublic.post(
    "users/confirm-email",
    {
      token,
    },
    { signal },
  )

  return data
}

export async function forgotPassword({ email }) {
  const { data } = await apiPublic.post("users/forgot-password", {
    email,
  })

  return data
}

export async function resetPassword({ token, password }) {
  const { data } = await apiPublic.post("users/reset-password", {
    token,
    password,
  })

  return data
}

export async function refreshToken() {
  const { data } = await apiPublic.get("users/refresh-token", {
    withCredentials: true,
  })

  return data.accessToken
}

export async function getUser(id) {
  const { data } = await apiPrivate.get(`users/get-user`, { params: { id } })

  return data
}

export async function updateBasicInfo({ name, headline, city, stateUf }) {
  const { data } = await apiPrivate.patch("users/update-basic-info", {
    name,
    headline,
    city,
    stateUf,
  })

  return data
}

export async function updateAvatar(formData) {
  const { data } = await apiPrivate.patch("users/update-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return data
}

export async function updateAbout(about) {
  const { data } = await apiPrivate.patch("users/update-about", {
    about,
  })

  return data
}

export async function createExperience(experience) {
  const { data } = await apiPrivate.post("users/create-experience", experience)

  return data
}

export async function editExperience(experience) {
  const { data } = await apiPrivate.patch("users/edit-experience", experience)

  return data
}

export async function deleteExperience(experienceId) {
  const { data } = await apiPrivate.delete("users/delete-experience", {
    params: { experienceId },
  })

  return data
}

export async function createAcademicEducation(academicEducation) {
  const { data } = await apiPrivate.post(
    "users/create-academic-education",
    academicEducation,
  )

  return data
}

export async function editAcademicEducation(academicEducation) {
  const { data } = await apiPrivate.patch(
    "users/edit-academic-education",
    academicEducation,
  )

  return data
}

export async function deleteAcademicEducation(academicEducationId) {
  const { data } = await apiPrivate.delete("users/delete-academic-education", {
    params: { academicEducationId },
  })

  return data
}

export async function createCertificate(certificate) {
  const { data } = await apiPrivate.post(
    "users/create-certificate",
    certificate,
  )

  return data
}

export async function editCertificate(certificate) {
  const { data } = await apiPrivate.patch("users/edit-certificate", certificate)

  return data
}

export async function deleteCertificate(certificateId) {
  const { data } = await apiPrivate.delete("users/delete-certificate", {
    params: { certificateId },
  })

  return data
}

export async function updateResume(formData) {
  const { data } = await apiPrivate.patch("users/update-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return data
}

export async function getSuggestions() {
  const { data } = await apiPrivate.get("users/get-suggestions")

  return data
}

export async function getNetworkUsers({ page, limit, type, keyword }) {
  const { data } = await apiPrivate.post("users/getNetworkUsers", {
    page: Number(page),
    limit: Number(limit),
    type,
    keyword,
  })

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })

  return data
}

export async function addNewFollow(userToFollowId) {
  const { data } = await apiPrivate.post("users/follow", {
    followerId: userToFollowId,
  })

  return data
}

export async function removeFollow(followerId) {
  const { data } = await apiPrivate.post("users/unfollow", {
    followerId,
  })

  return data
}

export async function getNetworkingUserInfo() {
  const { data } = await apiPrivate.get("users/get-network-user-info")

  return data
}

export async function sendCodeToEmail({ currentEmail, newEmail }) {
  const { data } = await apiPrivate.post("users/sendCodeToEmail", {
    currentEmail,
    newEmail,
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return data
}

export async function updateEmail({ currentEmail, newEmail, code }) {
  const { data } = await apiPrivate.post("users/updateEmail", {
    currentEmail,
    newEmail,
    code,
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return data
}

export async function updatePassword({ currentPassword, newPassword }) {
  const { data } = await apiPrivate.post("users/updatePassword", {
    currentPassword,
    newPassword,
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return data
}

export async function deleteAccount() {
  const { data } = await apiPrivate.delete("users/deleteAccount", {
    withCredentials: true,
  })

  return data
}
