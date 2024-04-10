import { useEffect, useState } from "react"
import { useWatch } from "react-hook-form"
import { checkVisibilityCondition } from "../utils"

export function useCheckRenderCondition(conditions = [], getValues) {
  const [isVisible, setIsVisible] = useState(true)

  let dependencyFields = []

  conditions.forEach((condition) => {
    if (condition.params) {
      dependencyFields = [...dependencyFields, ...condition.params]
    }
  })

  let dependencyFieldsValue = useWatch({
    // control,
    name: dependencyFields,
    defaultValue: "",
  })

  useEffect(() => {
    const isValid = checkVisibilityCondition(conditions, getValues())

    setIsVisible(isValid)
  }, [conditions, getValues, dependencyFieldsValue])

  return isVisible
}
