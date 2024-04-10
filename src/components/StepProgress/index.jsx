import "./index.scss"

function StepProgress({ steps = 3, currentStep = 1, style }) {
  const stepItems = Array.from({ length: steps }, (_, i) => i + 1)

  function returnStepClassName(stepIndex) {
    let className = "step-progress__item"
    if (stepIndex <= currentStep) className += " step-progress__item--active"

    return className
  }

  function returnLineClassName(index) {
    let className = "step-progress__line"
    if (index < currentStep) className += " step-progress__line--active"

    return className
  }

  return (
    <div className="step-progress" style={{ ...style }}>
      {stepItems.map((stepItem, index) => (
        <div key={stepItem}>
          <div className={returnStepClassName(stepItem)}>{stepItem}</div>
          {index < stepItems.length - 1 && (
            <div className={returnLineClassName(stepItem)} />
          )}
        </div>
      ))}
    </div>
  )
}

export default StepProgress
