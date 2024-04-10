export const emailFields = [
  {
    name: "newEmail",
    type: "text",
    hasLabel: true,
    label: "Novo e-mail",
    placeholder: "email@example.com",
    required: true,
  },
]

export const codeFields = [
  {
    name: "code",
    type: "text",
    hasLabel: true,
    label: "Código",
    placeholder: "Insira aqui o código recebido no seu e-mail",
    required: true,
  },
]

export const passwordFields = [
  {
    name: "currentPassword",
    type: "password",
    hasLabel: true,
    label: "Senha atual",
    placeholder: "Senha atual",
    required: true,
  },
  {
    name: "newPassword",
    type: "password",
    hasLabel: true,
    label: "Nova senha",
    placeholder: "Nova senha",
    required: true,
  },
  {
    name: "confirmPassword",
    type: "password",
    hasLabel: true,
    label: "Confirmar senha",
    placeholder: "Confirmar senha",
    required: true,
  },
]
