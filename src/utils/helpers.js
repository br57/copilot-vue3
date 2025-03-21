import { format, parseISO } from "date-fns";
import _getIcons from "@/utils/svgIcons";
import { useToast } from 'vue-toastification'
import $api from '@/utils/axios'
const toast = useToast()
 
export const dateTimeFormat = (date, frmt) => {
  frmt = frmt ?? 'Pp'
  return format(parseISO(date), frmt)
}

export const dateFormat = (date, frmt) => {
  frmt = frmt ?? 'P'
  return format(parseISO(date), frmt)
}

export const _empty = value => {

  if (typeof value === typeof undefined) return true

  if (value === undefined) return true

  if (value === "undefined") return true

  if (value === null) return true

  if (value === "null") return true

  if (value === false) return true

  if (value === "false") return true

  if (value === 0) return true

  if (value === "0") return true

  if (value instanceof Number && value < 0) return false

  if (typeof value === "object" && Object.keys(value).length === 0) return true

  if (typeof value === "array" && value.length === 0) return true

  if (typeof value === "string") {
    return value.trim().length === 0
  }

  return false
}


export const addNewFilter = (existingData, newData) => {
  if (_empty(newData)) return existingData
  if (_empty(newData[0])) return existingData
  if (_empty(newData[0].uuid)) return existingData

  const newObjects = newData.filter(
    ({ uuid: id1 }) => !existingData.some(({ uuid: id2 }) => id2 === id1),
  )

  existingData = existingData.map(
    ed => {
      const _ed = newData.find(j => j.uuid == ed.uuid)
      if (!_empty(_ed)) {
        return _ed
      }

      return ed
    },
  )

  return existingData.concat(newObjects)
}

export const addUpdateItem = (existingData, newData) => {
  if (_empty(newData)) return existingData
  if (_empty(newData.uuid)) return existingData
  const data = existingData.filter(i => i.uuid !== newData.uuid)

  data.push(newData)

  return data
}

export const dcdLrvlValdtnErr = Errs => {
  if (_empty(Errs)) return false
  const errors = []
  if (typeof Errs !== "object") return false
  if (Object.keys(Errs).length === 0) return false
  for (const key in Errs) {
    if (Errs[key].length > 0) {
      for (const ek in Errs[key]) {
        errors.push(Errs[key][ek])
      }
    }
  }

  return errors.length > 0 ? errors : false
}

export const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index
}

export const isNumeric = value => {
  if (_empty(value)) return false

  return !isNaN(parseInt(value))
}

export const strToLower = (value = null, makeSlug = false) => {
  if (typeof value !== "string") return value
  if (_empty(value)) return null
  if (makeSlug) return value.toLowerCase().replace(/\s+/g, "-")

  return value.toLowerCase()
}

export const strToUpper = value => {
  if (typeof value !== "string") return value
  if (_empty(value)) return null

  return value.toUpperCase()
}

export const _nl2Br = value => {
  return value.replace(/\n/g, "<br />")
}

export const _limitTo = (value, length) => {
  if (!value) return ""
  if (value.length > length) return value.substring(0, length) + "..."

  return value
}

export const _stripHtml = string => {
  return string.replace(/<[^>]+>/g, " ")
}

export const makeFormDataFromObject = input => {
  const data = new FormData()

  Object.keys(input).forEach((k, index) => {
    let type = typeof input[k]
    type = Array.isArray(input[k])
      ? "array"
      : Object.prototype.toString.call(input[k]) === "[object Object]"
        ? "object"
        : Object.prototype.toString.call(input[k]) === "[object Null]"
          ? "null"
          : type
    switch (type) {
      case "object": {
        if (
          input[k].src &&
          typeof input[k].src === "string" &&
          input[k].src.startsWith("blob")
        ) {
          data.append(k, input[k])
        } else {
          data.append(k, JSON.stringify(input[k]))
        }
        break
      }
      case "array": {
        input[k].forEach(value => {
          data.append(`${k}[]`, value)
        })
        break
      }
      case "null": {
        data.append(k, "")
        break
      }
      default: {
        const appendVal = typeof input[k] !== "undefined" ? input[k] : null
        if (appendVal !== null) data.append(k, appendVal)
      }
    }
  })

  return data
}

export const checkObjIsSame = (source, target) => {
  if (_empty(target)) return false
  const sourceKeys = Object.keys(source)

  return !sourceKeys.some(i => {
    if (_empty(target[i])) return true

    return source[i] != target[i]
  })
}

export const checkAllRequired = (requiredFields, formObj) => {
  if (_empty(requiredFields)) return false
  if (_empty(formObj)) return false

  return !requiredFields.some(i => {
    return _empty(formObj[i])
  })
}

export const createFormData = params => {
  const formData = new FormData()

  Object.keys(params).forEach(key => {
    const data = params[key]
    if (Array.isArray(data)) {
      data.forEach(subData => {
        formData.append(`${key}[]`, subData)
      })
    } else if (typeof data === 'object') {
      formData.append(key, JSON.stringify(data))
    } else {
      formData.append(key, data)
    }
  })

  return formData
}


export const getStatusBadgeColor = status => {
  let className = "primary"
  switch (status) {
    case "ORDERED":
    case "RECEIVED":
      className = "secondary"
      break

    case "STORECANCELLED":
    case "PROVIDEREJECTED":
    case "CANCELLED":
    case "DELIVERY_REJECTED":
      className = "danger"
      break

    case "SEARCHING":
    case "PROCESSING":
      className = "info"
      break

    case "ASSIGNED":
    case "STARTED":
      className = "primary"
      break

    case "ACCEPTED":
    case "REACHED":
    case "PICKEDUP":
    case "ARRIVED":
    case "SCHEDULED":
    case "OUT_FOR_DELIVERY":
      className = "primary"
      break

    case "DELIVERED":
    case "COMPLETED":
      className = "success"
      break

    case "WAITING_FOR_PAYMENT":
    case "READY_FOR_PICKUP":
      className = "warning"
      break

    default:
      className = "secondary"
      break
  }

  return className
}

export const getIcons = _getIcons;

export const cloneDeep = array => JSON.parse(JSON.stringify(array))

export const replaceUnderscore = textContent => {
  if (!textContent) return textContent

  return textContent.replace(/_/g, ' ')
}
export const noImageAvailable = import.meta.env.VITE_IMAGES_URL + "/default.png";

export const withBaseUrl = url => {
  if (!url) return false
  if (typeof url !== 'string') return true
  if (url.startsWith('data:')) return true
  return false
};

export const _image = url => {
  if (!url) return noImageAvailable
  if (Array.isArray(url)) {
    return url
  }
  if (url.startsWith('http')) {
    return url
  }
  const baseEndpoint = import.meta.env.VITE_API_URL
  if (url.startsWith('/storage')) {
    url = `${baseEndpoint}${url}`
  }
  if (url.startsWith('storage')) {
    url = `${baseEndpoint}/${url}`
  }

  return url
}


export const allowNumericOnly = (event) => {
  const key = event.keyCode || event.charCode;
  const allowedKeys = [
    8, // backspace
    46, // delete
    110, // decimal(numeric pad)
    190, // decimal (alpha pad)
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, // 0-9 (alpha pad)
    96, 97, 98, 99, 100, 101, 102, 103, 104, 105, // 0-9 (numeric pad)
  ];
  if (!allowedKeys.includes(key)) {
    event.preventDefault();
  }
};

export const toFixed = (value, points) => {
  if (!value) return 0
  if (!isNumeric(value)) return 0
  if (typeof points === 'undefined' || points === null) points = 2
  const intVal = parseInt(value)
  const floatVal = parseFloat(value)
  if (floatVal == intVal) return intVal;
  return floatVal.toFixed(points)
}


export const sharePage = (title, text, url) => {
  if (!url) {
    url = window.location.href
  }
  if(!title){
    title = document.title ?? 'MOM'
  }
  if(!text){
    text = document.querySelector('meta[name="description"]')?.getAttribute('content')
  }
  if (navigator.share) {
    navigator
      .share({
        title,
        text,
        url,
      })
      .then(() => {
        console.log('Thanks for sharing!')
      })
      .catch(err => {
        console.log("Couldn't share because of", err.message)
      })
  } else {
    console.log('web share not supported')
  }
}


export const downloadFile = url => {
  $api.get(`download?path=${url}`, { responseType: 'blob' })
    .then(res => {
      const tempUrl = URL.createObjectURL(res.data)
      const aTag = document.createElement('a')
      aTag.href = tempUrl
      aTag.download = url.replace(/^.*[\\\/]/, '')
      document.body.appendChild(aTag)
      aTag.click()
      URL.revokeObjectURL(tempUrl)
      aTag.remove()
    })
    .catch(err => {
      console.log(err)
      toast.error('Failed to download file!')
    })
}