const initialState = {
  user: {},
  conversationId: "",
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case "CHANGE_USER":
      return { ...state, user: action.payload }
    case "CHANGE_CONVERSATION_ID":
      return { ...state, conversationId: action.payload }
    default:
      return state
  }
}

export default reducer
