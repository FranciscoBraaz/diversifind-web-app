import { useCallback, useEffect, useRef, useState } from "react"

import "./index.scss"

const getTimeRemaining = (e) => {
  const total = Date.parse(e) - Date.parse(new Date())
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / 1000 / 60 / 60) % 24)
  return {
    total,
    hours,
    minutes,
    seconds,
  }
}

const ResendCodeTimer = ({
  text = "",
  time,
  loadingResend,
  onResend,
  actionWhenFinish,
}) => {
  const [timer, setTimer] = useState(null)
  const Ref = useRef(null)

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e)
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      setTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds),
      )
    } else {
      setTimer("00:00:00")
    }
  }

  const clearTimer = useCallback((e) => {
    if (Ref.current) clearInterval(Ref.current)
    const id = setInterval(() => {
      startTimer(e)
    }, 1000)
    Ref.current = id
  }, [])

  const getDeadTime = useCallback(() => {
    let deadline = time

    deadline.setSeconds(deadline.getSeconds())
    return deadline
  }, [time])

  // We can use useEffect so that when the component
  // mount the timer will start as soon as possible
  useEffect(() => {
    clearTimer(getDeadTime())

    /* Clear interval when component unmount */
    return () => {
      if (Ref.current) clearInterval(Ref.current)
    }
  }, [clearTimer, getDeadTime])

  useEffect(() => {
    if (actionWhenFinish && timer === "00:00:00") {
      actionWhenFinish()
    }
  }, [timer, actionWhenFinish])

  function returnClassName() {
    let className = "resend-code-timer"

    if (timer === "00:00:00") {
      className += " resend-code-timer--active"
    }

    return className
  }

  if (timer === "00:00:00" && !onResend) return null

  if (!timer) {
    return (
      <button type="button" className="resend-code-timer">
        Aguarde...
      </button>
    )
  }

  if (loadingResend) {
    return (
      <button type="button" className="resend-code-timer">
        Enviando e-mail...
      </button>
    )
  }

  return (
    <button
      type="button"
      className={returnClassName()}
      onClick={timer === "00:00:00" ? onResend : undefined}
    >
      {timer !== "00:00:00" ? `${text} (${timer})` : text}
    </button>
  )
}

export default ResendCodeTimer
