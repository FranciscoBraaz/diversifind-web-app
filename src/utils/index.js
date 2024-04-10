import moment from "moment"
import _ from "lodash"

/*
 * To get the value from local storage that matches the given key
 * @param {string} key
 * @returns The value of the key argument
 */
export function parseLocalStorageJson(key) {
  if (!key || typeof key !== "string") {
    throw new Error("Invalid key")
  }

  /**
   * Handle non-string value with JSON.parse.
   * Catch string value and return it
   */
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return localStorage.getItem(key)
  }
}

const formattedMonthNumbers = {
  "01": "1",
  "02": "2",
  "03": "3",
  "04": "4",
  "05": "5",
  "06": "6",
  "07": "7",
  "08": "8",
  "09": "9",
  10: "10",
  11: "11",
  12: "12",
}

const monthsMap = {
  "01": "Janeiro",
  "02": "Fevereiro",
  "03": "Março",
  "04": "Abril",
  "05": "Maio",
  "06": "Junho",
  "07": "Julho",
  "08": "Agosto",
  "09": "Setembro",
  10: "Outubro",
  11: "Novembro",
  12: "Dezembro",
}

export function createDateWithMonthAndYear(month, year) {
  return new Date(`${year}-${formattedMonthNumbers[month]}-01`)
}

export function formatPeriod({
  startDateMonth,
  startDateYear,
  endDateMonth,
  endDateYear,
}) {
  const start = createDateWithMonthAndYear(startDateMonth, startDateYear)
  const end = createDateWithMonthAndYear(endDateMonth, endDateYear)

  const startMonth = start.toLocaleString("pt-BR", { month: "short" })
  const startDateFormatted = `${startMonth} ${start.getFullYear()}`

  const endMonth = endDateMonth
    ? end.toLocaleString("pt-BR", { month: "short" })
    : null
  const endDateFormatted = endMonth
    ? `${endMonth} ${end.getFullYear()}`
    : "Atual"

  return `${startDateFormatted} - ${endDateFormatted}`
}

export function formatCertificateDate({ month, year }) {
  const monthFormatted = monthsMap[month]
  return `Emitido em ${monthFormatted} de ${year}`
}

function formatValue(params, formValue) {
  let newValues = {}
  for (let i = 0; i < params.length; i++) {
    const param = params[i]
    /* eslint-disable-next-line */
    if (!formValue.hasOwnProperty(param)) {
      newValues[param] = ""
      continue
    }

    if (!formValue[param]) {
      newValues[param] = ""
      continue
    }

    newValues[param] = formValue[param]
  }

  return newValues
}

export function checkVisibilityCondition(conditions = [], formValue) {
  if (_.isEmpty(conditions)) return true

  let allConditionsAreValid = []
  conditions.forEach((condition) => {
    if (condition.expression && condition.params.length > 0) {
      let newValues = formatValue(condition.params, formValue)

      /* eslint-disable-next-line */
      let rule = new Function("params", "moment", condition.expression)
      const result = rule(
        condition.params.map((param) => newValues[param]),
        moment,
      )

      allConditionsAreValid.push(result)
    }
  })
  const isVisible = allConditionsAreValid.every((isTrue) => isTrue)

  return isVisible
}

export function getPassedtime(date) {
  if (!date) return "-"

  const dateNow = moment()
  const postDate = moment(date)

  const yearsDiff = dateNow.diff(postDate, "years")
  const monthsDiff = dateNow.diff(postDate, "months")
  const daysDiff = dateNow.diff(postDate, "days")
  const hoursDiff = dateNow.diff(postDate, "hours")
  const minutesDiff = dateNow.diff(postDate, "minutes")
  const secondsDiff = dateNow.diff(postDate, "seconds")

  if (yearsDiff > 0) {
    return `${yearsDiff} a`
  } else if (monthsDiff > 0) {
    return `${monthsDiff} m`
  } else if (daysDiff > 0) {
    return `${daysDiff} d`
  } else if (hoursDiff > 0) {
    return `${hoursDiff} h`
  } else if (minutesDiff > 0) {
    return `${minutesDiff} min`
  } else {
    return `${secondsDiff} s`
  }
}

export function defineColor(name) {
  const colors = [
    "#EF5350",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFEB3B",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#795548",
    "#9E9E9E",
    "#607D8B",
  ]
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ]

  const index = alphabet.findIndex((e) => e === name[0].toUpperCase())
  if (colors.length <= index) return String(colors[index - colors.length])
  else return colors[index]
}

export const defineItemColor = (name) => {
  const hRange = [0, 360]
  const sRange = [50, 75]
  const lRange = [25, 60]

  const generateHSL = (name) => {
    const hash = getHashOfString(name)
    const h = normalizeHash(hash, hRange[0], hRange[1])
    const s = normalizeHash(hash, sRange[0], sRange[1])
    const l = normalizeHash(hash, lRange[0], lRange[1])
    return [h, s, l]
  }

  const getHashOfString = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    hash = Math.abs(hash)
    return hash
  }

  const normalizeHash = (hash, min, max) => {
    return Math.floor((hash % (max - min)) + min)
  }

  const hsl = generateHSL(name)
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`
}

function rgbToYIQ({ r, g, b }) {
  return (r * 299 + g * 587 + b * 114) / 1000
}

function hexToRgb(hex) {
  if (!hex || hex === undefined || hex === "") {
    return undefined
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : undefined
}

function HSLToRGB(hsl, isPct = false) {
  let ex =
    /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i
  if (ex.test(hsl)) {
    let sep = hsl.indexOf(",") > -1 ? "," : " "
    hsl = hsl.substr(4).split(")")[0].split(sep)
    isPct = isPct === true

    let h = hsl[0],
      s = hsl[1].substr(0, hsl[1].length - 1) / 100,
      l = hsl[2].substr(0, hsl[2].length - 1) / 100

    // strip label and convert to degrees (if necessary)
    if (h.indexOf("deg") > -1) h = h.substr(0, h.length - 3)
    else if (h.indexOf("rad") > -1)
      h = Math.round((h.substr(0, h.length - 3) / (2 * Math.PI)) * 360)
    else if (h.indexOf("turn") > -1)
      h = Math.round(h.substr(0, h.length - 4) * 360)
    // keep hue fraction of 360 if ending up over
    if (h >= 360) h %= 360

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0

    if (0 <= h && h < 60) {
      r = c
      g = x
      b = 0
    } else if (60 <= h && h < 120) {
      r = x
      g = c
      b = 0
    } else if (120 <= h && h < 180) {
      r = 0
      g = c
      b = x
    } else if (180 <= h && h < 240) {
      r = 0
      g = x
      b = c
    } else if (240 <= h && h < 300) {
      r = x
      g = 0
      b = c
    } else if (300 <= h && h < 360) {
      r = c
      g = 0
      b = x
    }

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    if (isPct) {
      r = +((r / 255) * 100).toFixed(1)
      g = +((g / 255) * 100).toFixed(1)
      b = +((b / 255) * 100).toFixed(1)
    }

    return (
      "rgb(" +
      (isPct ? r + "%," + g + "%," + b + "%" : +r + "," + +g + "," + +b) +
      ")"
    )
  } else {
    return "Invalid input color"
  }
}

export function defineColorConstrast(color, type = "hsl", threshold = 120) {
  if (color === undefined) {
    return "#000"
  }

  let rgb = undefined

  if (type === "hex") {
    hexToRgb(color)
  }

  if (type === "hsl") {
    let rgbString = HSLToRGB(color)
    rgbString = rgbString.replace("rgb", "").replace("(", "").replace(")", "")

    const splittedRgb = rgbString.split(",")

    rgb = {
      r: parseInt(splittedRgb[0]),
      g: parseInt(splittedRgb[1]),
      b: parseInt(splittedRgb[2]),
    }
  }

  if (rgb === undefined) {
    return "#000"
  }

  return rgbToYIQ(rgb) >= threshold ? "#000" : "#fff"
}
